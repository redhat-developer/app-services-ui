import React, { useCallback, VoidFunctionComponent } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth, useBasename, useConfig } from '@rhoas/app-services-ui-shared';
import { AppServicesLoading, Metrics, MetricsProps } from '@rhoas/app-services-ui-components';
import { fetchKafkaInstanceMetrics, fetchKafkaTopisFromAdmin, fetchMetricsKpi, fetchTopicMetrics } from './api';

type ConnectedMetricsProps = {
  kafkaId: string;
  kafkaAdminUrl: string;
};

export const ConnectedMetrics: VoidFunctionComponent<ConnectedMetricsProps> = ({ kafkaId, kafkaAdminUrl }) => {
  const auth = useAuth();
  const history = useHistory();
  const config = useConfig();
  const { getBasename } = useBasename() || {};
  const basename = getBasename && getBasename();

  const onCreateTopic = () => {
    history.push(`${basename}/topic/create`);
  };

  const getKafkaInstanceMetrics: MetricsProps['getKafkaInstanceMetrics'] = useCallback(
    (props) =>
      fetchKafkaInstanceMetrics({
        ...props,
        kafkaId,
        basePath: config.kas.apiBasePath,
        accessToken: auth?.kas.getToken(),
      }),
    [auth?.kas, config.kas.apiBasePath, kafkaId]
  );

  const getTopicMetrics: MetricsProps['getTopicsMetrics'] = useCallback(
    async (props) => {
      const [kafkaTopics, metrics] = await Promise.all([
        fetchKafkaTopisFromAdmin({
          accessToken: auth?.kafka.getToken(),
          basePath: kafkaAdminUrl,
        }),
        fetchTopicMetrics({
          ...props,
          kafkaId,
          basePath: config.kas.apiBasePath,
          accessToken: auth?.kas.getToken(),
        }),
      ]);
      const { metricsTopics, bytesIncoming, bytesOutgoing, bytesPerPartition, incomingMessageRate } = metrics;
      return {
        kafkaTopics,
        metricsTopics,
        bytesIncoming,
        bytesOutgoing,
        bytesPerPartition,
        incomingMessageRate,
      };
    },
    [auth?.kafka, auth?.kas, config.kas.apiBasePath, kafkaAdminUrl, kafkaId]
  );

  const getMetricsKpi: MetricsProps['getMetricsKpi'] = useCallback(
    () =>
      fetchMetricsKpi({
        kafkaId,
        basePath: config.kas.apiBasePath,
        accessToken: auth?.kas.getToken(),
      }),
    [auth?.kas, config.kas.apiBasePath, kafkaId]
  );

  if (config === undefined) {
    return <AppServicesLoading />;
  }

  return (
    <Metrics
      onCreateTopic={onCreateTopic}
      getTopicsMetrics={getTopicMetrics}
      getKafkaInstanceMetrics={getKafkaInstanceMetrics}
      getMetricsKpi={getMetricsKpi}
    />
  );
};
