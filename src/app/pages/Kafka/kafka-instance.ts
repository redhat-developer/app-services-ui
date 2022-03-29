import { useEffect, useState } from 'react';
import { Configuration, DefaultApi, KafkaRequest } from '@rhoas/kafka-management-sdk';
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

export const useKafkaInstance = (): KafkaInstance | false | undefined => {
  const config = useConfig();
  const auth = useAuth();
  const [kafkaRequest, setKafkaRequest] = useState<KafkaRequest | false | undefined>();
  const { id } = useParams<{ id: string }>();
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
        setKafkaRequest(kafka.data);
      } catch (e) {
        setKafkaRequest(false);
      }
    };

    getAdminApiUrl();
  }, [auth, config, id]);

  return kafkaRequest
    ? {
        kafkaDetail: kafkaRequest as Required<KafkaRequest>,
        adminServerUrl: getAdminServerUrl(
          config.kafka?.adminServerUrlTemplate || DEFAULT_ADMIN_SERVER_URL_TEMPLATE,
          kafkaRequest
        ),
      }
    : kafkaRequest;
};
