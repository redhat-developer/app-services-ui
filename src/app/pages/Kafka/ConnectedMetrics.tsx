import React, { useCallback, useState, VoidFunctionComponent } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth, useBasename, useConfig } from '@rhoas/app-services-ui-shared';
import { AppServicesLoading, Metrics, MetricsProps } from '@rhoas/app-services-ui-components';
import { fetchKafkaInstanceMetrics, fetchKafkaTopisFromAdmin, fetchMetricsKpi, fetchTopicMetrics } from './api';
import { SupportedKafkaSize } from '@rhoas/kafka-management-sdk';

type ConnectedMetricsProps = {
  kafkaId: string;
  kafkaAdminUrl: string;
  size: SupportedKafkaSize;
  kafkaStorageSize: number;
};

export const ConnectedMetrics: VoidFunctionComponent<ConnectedMetricsProps> = ({
  kafkaId,
  kafkaAdminUrl,
  size,
  kafkaStorageSize = 0,
}) => {
  const auth = useAuth();
  const history = useHistory();
  const config = useConfig();
  const { getBasename } = useBasename() || {};
  const basename = getBasename && getBasename();

  const [isAlertClosed, setIsAlertClosed] = useState<boolean>(false);

  const onAlertClose = () => {
    setIsAlertClosed(!isAlertClosed);
  };

  const onCreateTopic = () => {
    history.push(`${basename}/topic/create`);
  };

  const getKafkaInstanceMetrics: MetricsProps['getKafkaInstanceMetrics'] = useCallback(
    async (props) => {
      const kafkaResponse = await fetchKafkaInstanceMetrics({
        ...props,
        kafkaId,
        basePath: config.kas.apiBasePath,
        accessToken: auth?.kas.getToken(),
      });

      const { total_max_connections, max_connection_attempts_per_sec } = size || {};

      return {
        ...kafkaResponse,
        diskSpaceLimit: kafkaStorageSize * 1024 * 1024 * 1024,
        connectionsLimit: total_max_connections!,
        connectionRateLimit: max_connection_attempts_per_sec!,
      };
    },
    [auth?.kas, config.kas.apiBasePath, kafkaId, size]
  );

  const getTopicMetrics: MetricsProps['getTopicsMetrics'] = useCallback(
    async (props) => {
      const [kafkaTopics, metrics] = await Promise.all([
        fetchKafkaTopisFromAdmin({
          accessToken: auth?.kafka.getToken(),
          //replace is the temporary fix for /topics call for Dashboard
          //remove when we have latest kafka SDK in app-services-ui and kafka-ui
          basePath: kafkaAdminUrl?.replace('/rest', ''),
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

  const getMetricsKpi: MetricsProps['getMetricsKpi'] = useCallback(async () => {
    const kpiResponse = await fetchMetricsKpi({
      kafkaId,
      basePath: config.kas.apiBasePath,
      accessToken: auth?.kas.getToken(),
    });

    return { ...kpiResponse, topicPartitionsLimit: size?.max_partitions! };
  }, [auth?.kas, config.kas.apiBasePath, kafkaId, size]);

  if (config === undefined) {
    return <AppServicesLoading />;
  }

  return (
    <Metrics
      onCreateTopic={onCreateTopic}
      getTopicsMetrics={getTopicMetrics}
      getKafkaInstanceMetrics={getKafkaInstanceMetrics}
      getMetricsKpi={getMetricsKpi}
      isClosed={isAlertClosed}
      onClickClose={onAlertClose}
    />
  );
};
