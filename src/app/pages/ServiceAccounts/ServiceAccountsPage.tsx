import React, { VoidFunctionComponent } from 'react';
import { FederatedModule } from '@app/components';
import { useConfig } from '@rhoas/app-services-ui-shared';
import { ServiceDownPage } from '@app/pages/ServiceDown/ServiceDownPage';
import { AppServicesLoading } from '@rhoas/app-services-ui-components';

export const ServiceAccountsPage: VoidFunctionComponent = () => {
  return (
    <FederatedModule
      scope="kas"
      module="./ServiceAccounts"
      fallback={<AppServicesLoading />}
      render={(component) => <ServiceAccountsPageConnected Component={component} />}
    />
  );
};

const ServiceAccountsPageConnected: VoidFunctionComponent<{ Component: React.LazyExoticComponent<any> }> = ({
  Component,
}) => {
  const config = useConfig();
  if (config?.serviceDown) {
    return <ServiceDownPage />;
  }
  return <Component />;
};
export default ServiceAccountsPage;
