import { useEffect, useState, useCallback } from 'react';
import { Configuration, DefaultApi, KafkaRequest, SupportedKafkaSize } from '@rhoas/kafka-management-sdk';
import { useParams } from 'react-router-dom';
import { useAuth, useConfig } from '@rhoas/app-services-ui-shared';

const DEFAULT_ADMIN_SERVER_URL_TEMPLATE = 'https://admin-server-{}';

/**
 * Join admin server url template with the kafka bootstrap host and return the kafka admin url.
 *
 * @param adminServerUrlTemplate The template that will be used to generate the full admin url from the kafka bootstrap_server_host.
 *                               The template must have a '{}' placeholder that will be substitute with the bootstrap_server_host.
 * @param kafkaRequest KafkaRequest
 * @returns The admin server full URL included the protocol and base path
 */

export const getAdminServerUrl = (adminServerUrlTemplate: string, kafkaRequest?: KafkaRequest): string => {
  if (kafkaRequest === undefined) {
    throw new Error('kafkaRequest cannot be undefined');
  }
  return adminServerUrlTemplate.replace('{}', kafkaRequest.bootstrap_server_host || '');
};

export type KafkaInstance = {
  kafkaDetail: Required<KafkaRequest>;
  adminServerUrl: string;
};

export type KafkaRequestWithTopicConfig = KafkaRequest & {
  size: SupportedKafkaSize;
}

export const useKafkaInstance = (id: string): KafkaInstance | false | undefined => {
  const config = useConfig();
  const auth = useAuth();
  const [kafkaRequest, setKafkaRequest] = useState<KafkaRequestWithTopicConfig | false | undefined>();
  const getKafkaSize = useGetAvailableSizes();

  useEffect(() => {
    const getAdminApiUrl = async () => {
      if (auth === undefined || config === undefined) {
        return;
      }
      const kasService = new DefaultApi({
        accessToken: auth.kas.getToken,
        basePath: config.kas.apiBasePath || '',
      } as Configuration);
      try {
        const kafka = await kasService.getKafkaById(id);

        const { cloud_provider, region, instance_type, size_id } = kafka.data;
        if (!cloud_provider || !region || !size_id || !instance_type) {
          throw new Error(`Kafka instance ${kafka.data.id} missing some required info: ${cloud_provider}, ${region}, ${instance_type}, ${size_id}`)
        }
        const size = await getKafkaSize(cloud_provider, region, size_id, instance_type);

        setKafkaRequest({
          ...kafka.data,
          size
        });
      } catch (e) {
        setKafkaRequest(false);
      }
    };

    getAdminApiUrl();
  }, [auth, config, id]);

  return kafkaRequest
    ? {
      kafkaDetail: kafkaRequest as Required<KafkaRequestWithTopicConfig>,
      adminServerUrl: getAdminServerUrl(
        config.kafka?.adminServerUrlTemplate || DEFAULT_ADMIN_SERVER_URL_TEMPLATE,
        kafkaRequest
      ),
    }
    : kafkaRequest;
};

/**
 * Return list of the instance types available for the current user
 *
 * @returns {Promise<InstanceType[]>}
 */

export const useGetAvailableSizes = () => {
  const { kas: { getToken } } = useAuth();
  const {
    kas: { apiBasePath: basePath },
  } = useConfig();

  return useCallback(async (
    provider: string,
    region: string,
    sizeId: string,
    instanceType: string
  ): Promise<SupportedKafkaSize> => {
    try {
      const api = new DefaultApi(
        new Configuration({
          accessToken: getToken(),
          basePath,
        })
      );

      const sizes = await api.getInstanceTypesByCloudProviderAndRegion(
        provider,
        region
      );

      if (!sizes?.data?.instance_types) {
        throw new Error(`getInstanceTypesByCloudProviderAndRegion api failed for ${provider} ${region} ${sizeId}, no instance_types returned`)
      }
        const instanceTypesSizes = sizes?.data?.instance_types.find(
          (i) => i.id === instanceType
        )?.sizes;
        const size = instanceTypesSizes?.find((s) => s.id === sizeId);

        if (!size) {
          throw new Error(`getInstanceTypesByCloudProviderAndRegion api failed for ${provider} ${region} ${sizeId}, can't find a size matching ${sizeId}`)
        }

        return size;
    } catch (e: unknown) {
      throw new Error(`getInstanceTypesByCloudProviderAndRegion api failed for ${provider} ${region} ${sizeId}: ${e}`)
    }
  }, [getToken, basePath]);
};
