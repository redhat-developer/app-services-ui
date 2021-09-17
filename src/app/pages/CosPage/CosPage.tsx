import { FederatedModule } from '@app/components';
import { ServiceDownPage } from '@app/pages/ServiceDown/ServiceDownPage';
import { AppServicesLoading, useConfig } from '@rhoas/app-services-ui-shared';
import React from 'react';


export const CosPage: React.FunctionComponent = () => {
  const config = useConfig();

  if (config?.serviceDown) {
    return <ServiceDownPage/>;
  }

  return (
    <FederatedModule
      scope="cos"
      fallback={<AppServicesLoading/>}
      module="./OpenshiftManagedConnectors"
      render={(OpenshiftManagedConnectors) => <OpenshiftManagedConnectors/>}
    />
  )
};

export default CosPage;
