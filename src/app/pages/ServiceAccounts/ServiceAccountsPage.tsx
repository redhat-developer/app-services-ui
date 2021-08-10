import React from 'react';
import { FederatedModule, Loading } from '@app/components';
import { useConfig } from '@bf2/ui-shared';
import { ServiceDownPage } from '@app/pages/ServiceDown/ServiceDownPage';

export const ServiceAccountsPage: React.FunctionComponent = () => {
  const config = useConfig();
  return (
    <FederatedModule
      scope="kas"
      module="./ServiceAccounts"
      fallback={<Loading/>}
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
