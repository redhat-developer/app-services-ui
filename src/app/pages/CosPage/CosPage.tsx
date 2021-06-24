import { DevelopmentPreview, FederatedModule, Loading } from '@app/components';
import { ServiceDownPage } from '@app/pages/ServiceDown/ServiceDownPage';
import { useConfig } from '@bf2/ui-shared';
import React from 'react';


export const CosPage: React.FunctionComponent = () => {
  const config = useConfig();

  if (config?.serviceDown) {
    return <ServiceDownPage />;
  }

  return <CosPageConnected />;
};

export const CosPageConnected: React.FunctionComponent = () => {
  const config = useConfig();

  if (config === undefined) {
    return <Loading />;
  }

  const osCos = (
    <FederatedModule
      scope="cos"
      module="./OpenshiftManagedConnectors"
      render={(OpenshiftManagedConnectors) => <OpenshiftManagedConnectors/>}
    />
  );

  return <DevelopmentPreview> {osCos} </DevelopmentPreview>;
};
