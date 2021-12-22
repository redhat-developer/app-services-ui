import { OverviewPage } from '@rhoas/app-services-ui-components';
import React from 'react';

export const ConnectedOverviewPage: React.FunctionComponent = () => {
  const beta = location.pathname.startsWith('/beta');

  const kafkaHref = '/streams/kafkas';

  const serviceRegistryHref = beta ? '/service-registry' : '/beta/application-services/service-registry';

  return <OverviewPage toKafkaHref={kafkaHref} toServiceRegistryHref={serviceRegistryHref} />;
};

export default ConnectedOverviewPage;
