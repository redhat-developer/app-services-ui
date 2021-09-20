import { useEffect, useState } from "react";
import { Configuration, DefaultApi, KafkaRequest } from "@rhoas/kafka-management-sdk";
import { useParams } from "react-router-dom";
import { useAuth, useConfig } from "@bf2/ui-shared";

export const getAdminServerUrl = (kafkaRequest?: KafkaRequest): string => {
  if (kafkaRequest === undefined) {
    throw new Error('kafkaRequest cannot be undefined');
  }
  return `https://admin-server-${kafkaRequest?.bootstrap_server_host}/rest`;
}

export type KafkaInstance = {
  kafkaDetail?: KafkaRequest
  adminServerUrl?: string
}

export const useKafkaInstance = (): KafkaInstance => {
  const config = useConfig();
  const auth = useAuth();
  const [kafkaRequest, setKafkaRequest] = useState<KafkaRequest | undefined>();
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

      const kafka = await kasService.getKafkaById(id);
      setKafkaRequest(kafka.data);
    };

    getAdminApiUrl();
  }, [auth, config, id]);

  return {
    kafkaDetail: kafkaRequest,
    adminServerUrl: getAdminServerUrl(kafkaRequest),
  }
}
