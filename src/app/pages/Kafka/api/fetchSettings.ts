import { Configuration, DefaultApi } from "@rhoas/kafka-management-sdk";
import { BasicApiConfigurationParameters } from "./types";

type fetchSettingsProp = {
  kafkaId: string;
  owner: string;
  settings: boolean;
} & BasicApiConfigurationParameters;
export async function fetchSettings({
  kafkaId,
  owner,
  settings,
  accessToken,
  basePath,
}: fetchSettingsProp) {
  const apisService = new DefaultApi(
    new Configuration({
      accessToken,
      basePath,
    })
  );
  const response = await apisService.updateKafkaById(kafkaId, {
    owner: owner,
    reauthentication_enabled: settings,
  });

  return response.data.reauthentication_enabled;
}
