import React from 'react';
import { FederatedModule } from '@app/components';
import { AppServicesLoading, useConfig } from '@rhoas/app-services-ui-shared';
import { ServiceDownPage } from '@app/pages/ServiceDown/ServiceDownPage';

export const ServiceAccountsPage: React.FunctionComponent = () => {
  const config = useConfig();
  return (
    <FederatedModule
      scope="kas"
      module="./ServiceAccounts"
      fallback={<AppServicesLoading/>}
      render={(ServiceAccountsFederated) => {


        if (config?.serviceDown) {
          return <ServiceDownPage/>;
        }
        return <ServiceAccountsFederated/>;
      }}
    />
  );
};

export default ServiceAccountsPage;
