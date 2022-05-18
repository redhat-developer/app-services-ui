import { OverviewPageV2 } from '@rhoas/app-services-ui-components';
import React from 'react';

export const ConnectedOverviewPage: React.FunctionComponent = () => {

  const kafkaHref = '/streams/kafkas';
  const serviceRegistryHref = '/service-registry';

  const connectorHref = '/connectors';

  return <OverviewPageV2 toKafkaHref={kafkaHref} toServiceRegistryHref={serviceRegistryHref} toConnectorsHref={connectorHref} />;
};

export default ConnectedOverviewPage;
