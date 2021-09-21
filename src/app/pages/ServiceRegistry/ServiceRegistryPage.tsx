import React from 'react';
import { useConfig } from '@rhoas/app-services-ui-shared';
import { DevelopmentPreview, FederatedModule } from '@app/components';
import { ServiceDownPage } from '@app/pages';
import { useModalControl } from '@app/hooks';
import { AppServicesLoading } from "@rhoas/app-services-ui-components";

export const ServiceRegistryPage: React.FunctionComponent = () => {
  const config = useConfig();

  if (config?.serviceDown) {
    return <ServiceDownPage/>;
  }

  return <ServiceRegistryPageConnected/>;
};

export const ServiceRegistryPageConnected: React.FC = () => {
  const config = useConfig();
  const { preCreateInstance, shouldOpenCreateModal } = useModalControl();

  // Wait for the config and the registry to load
  if (config === undefined) {
    return <AppServicesLoading/>;
  }

  return (
    <DevelopmentPreview>
      <FederatedModule
        scope="srs"
        module="./ServiceRegistry"
        fallback={<AppServicesLoading/>}
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
