import { GetKafkaInstanceMetricsResponse, GetTopicsMetricsResponse } from '@rhoas/app-services-ui-components';
import { TopicsApi } from '@rhoas/kafka-instance-sdk';
import { Configuration, ConfigurationParameters, DefaultApi, RangeQuery } from '@rhoas/kafka-management-sdk';

type NoUndefinedField<T> = {
  [P in keyof T]-?: NoUndefinedField<NonNullable<T[P]>>;
};
type SafeRangeQuery = NoUndefinedField<RangeQuery>;

export type TimeSeriesMetrics = { [timestamp: number]: number };
export type PartitionBytesMetric = { [partition: string]: TimeSeriesMetrics };

export type BasicApiConfigurationParameters = Pick<ConfigurationParameters, 'accessToken' | 'basePath'>;

type FetchDiskSpaceMetricsProps = {
  kafkaId: string;
  duration: number;
  interval: number;
} & BasicApiConfigurationParameters;
export const fetchKafkaInstanceMetrics = async ({
  kafkaId,
  duration,
  interval,
  accessToken,
  basePath,
}: FetchDiskSpaceMetricsProps): Promise<GetKafkaInstanceMetricsResponse> => {
  const apisService = new DefaultApi(
    new Configuration({
      accessToken,
      basePath,
    })
  );

  const response = await apisService.getMetricsByRangeQuery(kafkaId, duration, interval, [
    'kubelet_volume_stats_used_bytes',
  ]);

  // Remove all results with no data. Not sure this can really  happen but since
  // the types allow for undefined we need to do a bit of defensive programming.
  const safeMetrics: SafeRangeQuery[] = (response.data.items || []).filter(
    (m) =>
      // defensive programming
      !(
        m.values &&
        m.metric &&
        m.metric.topic &&
        m.metric.name &&
        m.metric.persistentvolumeclaim &&
        m.metric.persistentvolumeclaim.includes('zookeeper')
      )
  ) as SafeRangeQuery[];

  const usedDiskSpaceMetrics: TimeSeriesMetrics = {};

  safeMetrics.forEach((m) => {
    m.values.forEach(
      ({ value, timestamp }) => (usedDiskSpaceMetrics[timestamp] = value + (usedDiskSpaceMetrics[timestamp] || 0))
    );
  });
  return {
    usedDiskSpaceMetrics,
    clientConnectionsMetrics: [],
    connectionAttemptRateMetrics: [],
  };
};

type FetchTopicsMetricsProps = {
  kafkaAdminServerUrl: string;
  kafkaAdminAccessToken: undefined | Promise<string>;
} & FetchRawTopicsMetricsProps;
export const fetchTopicsMetrics = async (props: FetchTopicsMetricsProps): Promise<GetTopicsMetricsResponse> => {
  const [kafkaTopics, metrics] = await Promise.all([
    fetchKafkaTopis({
      basePath: props.kafkaAdminServerUrl,
      accessToken: props.kafkaAdminAccessToken,
    }),
    fetchRawTopicMetrics(props),
  ]);
  const { topics: metricsTopics, bytesIncoming, bytesOutgoing, bytesPerPartition, incomingMessageRate } = metrics;
  return {
    kafkaTopics,
    metricsTopics,
    bytesIncoming,
    bytesOutgoing,
    bytesPerPartition,
    incomingMessageRate,
  };
};

export const fetchKafkaTopis = async ({
  accessToken,
  basePath,
}: BasicApiConfigurationParameters): Promise<string[]> => {
  const api = new TopicsApi(
    new Configuration({
      accessToken,
      basePath,
    })
  );
  const response = await api.getTopics(undefined, 100, 100, undefined, undefined, undefined, undefined);
  return (response.data.items || []).map((t) => t.name as string);
};

type FetchRawTopicsMetricsProps = {
  kafkaId: string;
  duration: number;
  interval: number;
  selectedTopic: string | undefined;
} & BasicApiConfigurationParameters;
type FetchRawTopicsMetricsReturnValue = {
  topics: string[];
  bytesOutgoing: TimeSeriesMetrics;
  bytesIncoming: TimeSeriesMetrics;
  bytesPerPartition: PartitionBytesMetric;
  incomingMessageRate: TimeSeriesMetrics;
};
export async function fetchRawTopicMetrics({
  accessToken,
  basePath,
  kafkaId,
  duration,
  interval,
  selectedTopic,
}: FetchRawTopicsMetricsProps): Promise<FetchRawTopicsMetricsReturnValue> {
  const privateTopics = ['__consumer_offsets', '__strimzi_canary'];

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
      !(m.values && m.metric && m.metric.topic && m.metric.name) && !privateTopics.includes(m.metric?.topic || '')
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
    topics,
    bytesOutgoing,
    bytesIncoming,
    bytesPerPartition,
    incomingMessageRate,
  };
}
