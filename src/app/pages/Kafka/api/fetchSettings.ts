import {
  Configuration,
  DefaultApi,
  KafkaUpdateRequest,
} from "@rhoas/kafka-management-sdk";
import { BasicApiConfigurationParameters } from "./types";

type fetchSettingsProp = {
  kafkaId: string;
  updateKafka: KafkaUpdateRequest;
  // owner: string | null;
  // settings: boolean | null;
} & BasicApiConfigurationParameters;
export async function fetchSettings({
  kafkaId,
  // owner,
  // settings
  updateKafka,
  accessToken,
  basePath,
}: fetchSettingsProp) {
  const apisService = new DefaultApi(
    new Configuration({
      accessToken,
      basePath,
    })
  );
  const response = await apisService.updateKafkaById(kafkaId, updateKafka);

  return response.status;
}
