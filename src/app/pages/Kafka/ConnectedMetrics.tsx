import React, { VoidFunctionComponent } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth, useBasename, useConfig } from '@rhoas/app-services-ui-shared';
import { AppServicesLoading, Metrics, MetricsProps, MetricsI18n } from '@rhoas/app-services-ui-components';
import { fetchKafkaInstanceMetrics, fetchTopicsMetrics } from './metricsApi';
import { I18nextProvider, useTranslation } from 'react-i18next';

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
  const { i18n } = useTranslation();

  i18n.addResourceBundle('en', 'translation', MetricsI18n);

  if (config === undefined) {
    return <AppServicesLoading />;
  }

  const onCreateTopic = () => {
    history.push(`${basename}/topic/create`);
  };

  const getKafkaInstanceMetrics: MetricsProps['getKafkaInstanceMetrics'] = (props) =>
    fetchKafkaInstanceMetrics({
      ...props,
      kafkaId,
      basePath: config.kas.apiBasePath,
      accessToken: auth?.kas.getToken(),
    });

  const getTopicMetrics: MetricsProps['getTopicsMetrics'] = (props) =>
    fetchTopicsMetrics({
      ...props,
      kafkaAdminAccessToken: auth?.kafka.getToken(),
      kafkaAdminServerUrl: kafkaAdminUrl,
      kafkaId,
      basePath: config.kas.apiBasePath,
      accessToken: auth?.kas.getToken(),
    });

  return (
    <I18nextProvider i18n={i18n}>
      <Metrics
        onCreateTopic={onCreateTopic}
        getTopicsMetrics={getTopicMetrics}
        getKafkaInstanceMetrics={getKafkaInstanceMetrics}
      />
    </I18nextProvider>
  );
};
