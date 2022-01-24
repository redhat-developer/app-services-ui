import { OverviewPage } from '@rhoas/app-services-ui-components';
import React from 'react';

export const ConnectedOverviewPage: React.FunctionComponent = () => {

  const kafkaHref = '/streams/kafkas';
  const serviceRegistryHref ='/service-registry';

  return <OverviewPage toKafkaHref={kafkaHref} toServiceRegistryHref={serviceRegistryHref} />;
};

export default ConnectedOverviewPage;
