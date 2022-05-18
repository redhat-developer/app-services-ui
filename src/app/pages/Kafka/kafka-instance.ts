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
  replication_factor?: number;
  min_in_sync_replicas?: number;
}

export const useKafkaInstance = (): KafkaInstance | false | undefined => {
  const config = useConfig();
  const auth = useAuth();
  const [kafkaRequest, setKafkaRequest] = useState<KafkaRequestWithTopicConfig | false | undefined>();
  const { id } = useParams<{ id: string }>();
  const getKafkaSize = useGetAvailableSizes();

  useEffect(() => {
    const getAdminApiUrl = async () => {
      if (auth === undefined || config === undefined) {
        return;
      }
      const accessToken = await auth.kas.getToken();
      const kasService = new DefaultApi({
        accessToken,
        basePath: config.kas.apiBasePath || '',
      } as Configuration);
      try {
        const kafka = await kasService.getKafkaById(id);

        const { cloud_provider, region, instance_type, size_id } = kafka.data;

        if (cloud_provider && region && instance_type && size_id) {
          const kafkaSize: SupportedKafkaSize | undefined = await getKafkaSize(cloud_provider, region, size_id, instance_type);
          const { replication_factor, min_in_sync_replicas } = kafkaSize || {};
          if (replication_factor && min_in_sync_replicas) {
            kafka.data["replication_factor"] = replication_factor;
            kafka.data["min_in_sync_replicas"] = min_in_sync_replicas;
          }
        }

        setKafkaRequest(kafka.data);
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
  ): Promise<SupportedKafkaSize | undefined> => {
    if (instanceType === undefined || provider === undefined || region === undefined || sizeId === undefined) {
      return;
    }

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

      if (sizes?.data?.instance_types) {
        const instanceTypesSizes = sizes?.data?.instance_types.find(
          (i) => i.id === instanceType
        )?.sizes;
        return instanceTypesSizes?.find((s) => s.id === sizeId);
      }

    } catch (e) {
      console.log("getInstanceTypesByCloudProviderAndRegion api failed");
      return;
    }
  }, [getToken, basePath]);
};