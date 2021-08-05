import React from 'react';
import { FederatedModule, DevelopmentPreview, Loading } from '@app/components';
import { useConfig } from '@bf2/ui-shared';
import { ServiceDownPage } from '@app/pages/ServiceDown/ServiceDownPage';

export const ServiceAccountsPage: React.FunctionComponent = () => {
  const config = useConfig();

  if (config?.serviceDown) {
    return <ServiceDownPage />;
  }

  return <ServiceAccountsPageConnected />;
};

const ServiceAccountsPageConnected: React.FunctionComponent = () => {
  const config = useConfig();

  if (config === undefined) {
    return <Loading />;
  }

  return (
    <DevelopmentPreview>
      <FederatedModule
        scope="kas"
        module="./ServiceAccounts"
        fallback={<Loading />}
        render={(ServiceAccountsFederated) => {
          return <ServiceAccountsFederated />;
        }}
      />
    </DevelopmentPreview>
  );
};

export default ServiceAccountsPage;
