import React from 'react';
import { useConfig } from '@bf2/ui-shared';
import { DevelopmentPreview, FederatedModule, Loading } from '@app/components';
import { ServiceDownPage } from '@app/pages';
import { useModalControl } from '@app/hooks';

export const ServiceRegistryPage: React.FunctionComponent = () => {
  const config = useConfig();

  if (config?.serviceDown) {
    return <ServiceDownPage />;
  }

  return <ServiceRegistryPageConnected />;
};

export const ServiceRegistryPageConnected: React.FC = () => {
  const config = useConfig();
  const { preCreateInstance, shouldOpenCreateModal } = useModalControl();

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
          return (
            <ServiceRegistryFederated
              preCreateInstance={preCreateInstance}
              shouldOpenCreateModal={shouldOpenCreateModal}
            />
          );
        }}
      />
    </DevelopmentPreview>
  );
};

export default ServiceRegistryPage;
