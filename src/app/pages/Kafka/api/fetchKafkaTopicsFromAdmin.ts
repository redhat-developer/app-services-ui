import { TopicsApi } from '@rhoas/kafka-instance-sdk';
import { Configuration } from '@rhoas/kafka-management-sdk';
import { BasicApiConfigurationParameters } from './types';

export async function fetchKafkaTopisFromAdmin({
  accessToken,
  basePath,
}: BasicApiConfigurationParameters): Promise<string[]> {
  const api = new TopicsApi(
    new Configuration({
      accessToken,
      basePath,
    })
  );
  const response = await api.getTopics(undefined, 100, 100, undefined, undefined, undefined, undefined);
  return (response.data.items || []).map((t) => t.name as string);
}
