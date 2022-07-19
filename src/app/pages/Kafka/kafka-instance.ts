import { useEffect, useState, useCallback } from "react";
import {
  Configuration,
  DefaultApi,
  KafkaRequest,
  SupportedKafkaSize,
} from "@rhoas/kafka-management-sdk";
import { useAuth, useConfig } from "@rhoas/app-services-ui-shared";

/**
 * Join admin server url template with the kafka bootstrap host and return the kafka admin url.
 *
 * @param kafkaRequest KafkaRequest
 * @returns The admin server full URL included the protocol and base path
 */

export const getAdminServerUrl = (
  kafkaRequest?: KafkaRequest
): string | undefined => {
  if (!kafkaRequest) {
    throw new Error("kafkaRequest cannot be undefined");
  }
  /**
   * admin_api_server_url will be available when kafka instance will be ready
   */
  return kafkaRequest.admin_api_server_url
    ? kafkaRequest.admin_api_server_url
    : undefined;
};

export type KafkaInstance = {
  kafkaDetail: Required<KafkaRequestWithSize>;
  adminServerUrl: string | undefined;
};

export type KafkaRequestWithSize = KafkaRequest & {
  size: SupportedKafkaSize;
};

export const useKafkaInstance = (
  id: string | undefined
): KafkaInstance | false | undefined => {
  const {
    kas: { apiBasePath },
  } = useConfig();
  const {
    kas: { getToken },
  } = useAuth();
  const [kafkaRequest, setKafkaRequest] = useState<
    KafkaRequestWithSize | false | undefined
  >();
  const getKafkaSize = useGetAvailableSizes();

  const fetchKafka = useCallback(
    async (id: string) => {
      setKafkaRequest(undefined);
      const kasService = new DefaultApi({
        accessToken: getToken,
        basePath: apiBasePath,
      } as Configuration);
      try {
        const kafka = await kasService.getKafkaById(id);

        const { cloud_provider, region, instance_type, size_id } = kafka.data;
        if (!cloud_provider || !region || !size_id || !instance_type) {
          throw new Error(
            `Kafka instance ${kafka.data.id} missing some required info: ${cloud_provider}, ${region}, ${instance_type}, ${size_id}`
          );
        }
        const size = await getKafkaSize(
          cloud_provider,
          region,
          size_id,
          instance_type
        );

        setKafkaRequest({
          ...kafka.data,
          size,
        });
      } catch (e) {
        setKafkaRequest(false);
      }
    },
    [apiBasePath, getKafkaSize, getToken]
  );

  useEffect(() => {
    if (id) {
      fetchKafka(id);
    } else {
      setKafkaRequest(undefined);
    }
  }, [fetchKafka, id]);

  return kafkaRequest
    ? {
        kafkaDetail: kafkaRequest as Required<KafkaRequestWithSize>,
        adminServerUrl: getAdminServerUrl(kafkaRequest),
      }
    : kafkaRequest;
};

/**
 * Return list of the instance types available for the current user
 *
 * @returns {Promise<InstanceType[]>}
 */

export const useGetAvailableSizes = () => {
  const {
    kas: { getToken },
  } = useAuth();
  const {
    kas: { apiBasePath: basePath },
  } = useConfig();

  return useCallback(
    async (
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
          throw new Error(
            `getInstanceTypesByCloudProviderAndRegion api failed for ${provider} ${region} ${sizeId}, no instance_types returned`
          );
        }
        const instanceTypesSizes = sizes?.data?.instance_types.find(
          (i) => i.id === instanceType
        )?.sizes;
        const size = instanceTypesSizes?.find((s) => s.id === sizeId);

        if (!size) {
          throw new Error(
            `getInstanceTypesByCloudProviderAndRegion api failed for ${provider} ${region} ${sizeId}, can't find a size matching ${sizeId}`
          );
        }

        return size;
      } catch (e: unknown) {
        throw new Error(
          `getInstanceTypesByCloudProviderAndRegion api failed for ${provider} ${region} ${sizeId}: ${e}`
        );
      }
    },
    [getToken, basePath]
  );
};
