import React from 'react';
import { useConfig } from '@bf2/ui-shared';
import { DevelopmentPreview, FederatedModule, Loading } from '@app/components';
import { ServiceDownPage } from '@app/pages';

export const ServiceRegistry: React.FunctionComponent = () => {
  const config = useConfig();

  if (config?.serviceDown) {
    return <ServiceDownPage />;
  }

  return <ServiceRegistryConnected />;
};

export const ServiceRegistryConnected: React.FC = () => {
  const config = useConfig();

  // Wait for the config and the registry to load
  if (config === undefined) {
    return <Loading />;
  }

  return (
    <DevelopmentPreview>
      <FederatedModule
        scope="srs"
        module="./ServiceRegistry"
        fallback={<Loading />}
        render={(ServiceRegistryFederated) => {
          return <ServiceRegistryFederated />;
        }}
      />
    </DevelopmentPreview>
  );
};
