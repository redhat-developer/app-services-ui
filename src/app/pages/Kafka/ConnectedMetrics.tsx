import React, { useCallback, useState, VoidFunctionComponent } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth, useBasename, useConfig } from '@rhoas/app-services-ui-shared';
import { AppServicesLoading, Metrics, MetricsProps } from '@rhoas/app-services-ui-components';
import { fetchKafkaInstanceMetrics, fetchKafkaTopisFromAdmin, fetchMetricsKpi, fetchTopicMetrics } from './api';

type ConnectedMetricsProps = {
  kafkaId: string;
  kafkaAdminUrl: string;
  totalMaxConnections: number;
  maxConnections: number;
  maxPartitions: number;
  kafkaStorageBytes: number;
};

export const ConnectedMetrics: VoidFunctionComponent<ConnectedMetricsProps> = ({
  kafkaId,
  kafkaAdminUrl,
  totalMaxConnections,
  maxConnections,
  maxPartitions,
  kafkaStorageBytes,
}) => {
  const auth = useAuth();
  const history = useHistory();
  const config = useConfig();
  const { getBasename } = useBasename() || {};
  const basename = getBasename && getBasename();

  const storageKey = `metrics-alert-${kafkaId}`;

  const [isAlertClosed, setIsAlertClosed] = useState<boolean>(localStorage.getItem(storageKey) !== null);

  const onAlertClose = () => {
    setIsAlertClosed(true);
    localStorage.setItem(storageKey, 'true');
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

      return {
        ...kafkaResponse,
        diskSpaceLimit: kafkaStorageBytes / 1073741824,
        connectionsLimit: totalMaxConnections,
        connectionRateLimit: maxConnections,
      };
    },
    [auth?.kas, config.kas.apiBasePath, kafkaId, totalMaxConnections, maxConnections]
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

  const getMetricsKpi: MetricsProps['getMetricsKpi'] = useCallback(async () => {
    const kpiResponse = await fetchMetricsKpi({
      kafkaId,
      basePath: config.kas.apiBasePath,
      accessToken: auth?.kas.getToken(),
    });

    return { ...kpiResponse, topicPartitionsLimit: maxPartitions };
  }, [auth?.kas, config.kas.apiBasePath, kafkaId, maxPartitions]);

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
