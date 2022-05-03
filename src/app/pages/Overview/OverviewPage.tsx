import { OverviewPage, OverviewPageV2 } from '@rhoas/app-services-ui-components';
import { startOfDay } from 'date-fns';
import React from 'react';

export const ConnectedOverviewPage: React.FunctionComponent = () => {

  const kafkaHref = '/streams/kafkas';
  const serviceRegistryHref = '/service-registry';

  const connectorHref = '/connectors';

  const currentDate = startOfDay(new Date());
  const releaseDate = startOfDay(new Date('May 05 2022'));

  const testRelease = new URLSearchParams((new URL(document.location.toString())).search).get('testRelease')

  if (currentDate >= releaseDate || testRelease !== null) {
    return <OverviewPageV2 toKafkaHref={kafkaHref} toServiceRegistryHref={serviceRegistryHref} toConnectorsHref={connectorHref} />;
  } else {
    return <OverviewPage toKafkaHref={kafkaHref} toServiceRegistryHref={serviceRegistryHref} />;
  }
};

export default ConnectedOverviewPage;
