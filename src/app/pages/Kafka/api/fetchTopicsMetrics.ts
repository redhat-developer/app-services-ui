import { GetTopicsMetricsResponse, PartitionBytesMetric, TimeSeriesMetrics } from '@rhoas/app-services-ui-components';
import { Configuration, DefaultApi } from '@rhoas/kafka-management-sdk';
import { BasicApiConfigurationParameters, SafeRangeQuery } from './types';

export type FetchTopicsMetricsProps = {
  kafkaId: string;
  duration: number;
  interval: number;
  selectedTopic: string | undefined;
} & BasicApiConfigurationParameters;

export async function fetchTopicMetrics({
  accessToken,
  basePath,
  kafkaId,
  duration,
  interval,
  selectedTopic,
}: FetchTopicsMetricsProps): Promise<Omit<GetTopicsMetricsResponse, 'kafkaTopics'>> {
  const apisService = new DefaultApi(
    new Configuration({
      accessToken,
      basePath,
    })
  );

  const response = await apisService.getMetricsByRangeQuery(kafkaId, duration, interval, [
    'kafka_server_brokertopicmetrics_bytes_in_total',
    'kafka_server_brokertopicmetrics_bytes_out_total',
    'kafka_topic:kafka_log_log_size:sum',
    'kafka_server_brokertopicmetrics_messages_in_total',
  ]);

  // Remove all results with no data. Not sure this can really  happen but since
  // the types allow for undefined we need to do a bit of defensive programming.
  const safeMetrics: SafeRangeQuery[] = (response.data.items || []).filter(
    (m) =>
      // defensive programming
      !(m.values && m.metric && m.metric.topic && m.metric.name)
  ) as SafeRangeQuery[];

  // Also filter for metrics about the selectedTopic, if specified
  const filteredMetrics = safeMetrics.filter((m) =>
    // filter for metrics for the selectedTopic, if needed
    selectedTopic !== undefined ? m.metric?.topic === selectedTopic : true
  );

  // get the unique topics we have metrics for in the selected time range
  const topics = Array.from(new Set(safeMetrics.map((m) => m.metric.topic)));

  const bytesIncoming: TimeSeriesMetrics = {};
  const bytesOutgoing: TimeSeriesMetrics = {};
  const bytesPerPartition: PartitionBytesMetric = {};
  const incomingMessageRate: TimeSeriesMetrics = {};

  filteredMetrics.forEach((m) => {
    const { __name__: name, topic } = m.metric;

    function addAggregatedTotalBytesTo(metric: TimeSeriesMetrics) {
      m.values.forEach(({ value, timestamp }) => (metric[timestamp] = value + (metric[timestamp] || 0)));
    }

    function addAggregatePartitionBytes() {
      const partition = bytesPerPartition[topic] || {};
      m.values.forEach(({ value, timestamp }) => (partition[timestamp] = value + (partition[timestamp] || 0)));
      bytesPerPartition[topic] = partition;
    }

    switch (name) {
      case 'kafka_server_brokertopicmetrics_bytes_in_total':
        addAggregatedTotalBytesTo(bytesIncoming);
        break;
      case 'kafka_server_brokertopicmetrics_bytes_out_total':
        addAggregatedTotalBytesTo(bytesOutgoing);
        break;
      case 'kafka_topic:kafka_log_log_size:sum':
        addAggregatePartitionBytes();
        break;
      case 'kafka_server_brokertopicmetrics_messages_in_total':
        addAggregatedTotalBytesTo(incomingMessageRate);
        break;
    }
  });

  return {
    metricsTopics: topics,
    bytesOutgoing,
    bytesIncoming,
    bytesPerPartition,
    incomingMessageRate,
  };
}
