import { GetMetricsKpiResponse } from '@rhoas/app-services-ui-components';
import { Configuration, DefaultApi, InstantQuery } from '@rhoas/kafka-management-sdk';
import { BasicApiConfigurationParameters, NoUndefinedField } from './types';

export type FetchMetricsKpiProps = {
  kafkaId: string;
} & BasicApiConfigurationParameters;

export async function fetchMetricsKpi({
  accessToken,
  basePath,
  kafkaId,
}: FetchMetricsKpiProps): Promise<Omit<GetMetricsKpiResponse, 'kafkaTopics'>> {
  const apisService = new DefaultApi(
    new Configuration({
      accessToken,
      basePath,
    })
  );

  let topics = 0,
    topicPartitions = 0,
    consumerGroups = 0;

  const response = await apisService.getMetricsByInstantQuery(kafkaId, [
    'kafka_topic:kafka_topic_partitions:sum', // (Number of topic partitions)
    'kafka_topic:kafka_topic_partitions:count', // (Number of topics)
    'consumergroup:kafka_consumergroup_members:count', // (number of consumer groups - note that this metric will appear after a consumer group is created. There should be handled by the UI in a way that the metric isn't visible if no consumer groups are created)
  ]);

  const safeMetrics: NoUndefinedField<InstantQuery[]> = (response.data.items || []) as NoUndefinedField<InstantQuery[]>;

  safeMetrics.forEach(({ metric, value }) => {
    const { __name__: name } = metric;

    switch (name) {
      case 'kafka_topic:kafka_topic_partitions:sum':
        topicPartitions = value;
        break;
      case 'kafka_topic:kafka_topic_partitions:count':
        topics = value;
        break;
      case 'consumergroup:kafka_consumergroup_members:count':
        consumerGroups = value;
        break;
    }
  });
  return {
    consumerGroups,
    topicPartitions,
    topics,
  };
}
