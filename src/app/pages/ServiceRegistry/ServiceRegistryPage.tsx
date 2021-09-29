import React from 'react';
import { useConfig } from '@rhoas/app-services-ui-shared';
import { RegistryRest } from '@rhoas/registry-management-sdk';
import { DevelopmentPreview, FederatedModule } from '@app/components';
import { ServiceDownPage } from '@app/pages';
import { useModalControl, useQuota } from '@app/hooks';
import { AppServicesLoading } from '@rhoas/app-services-ui-components';
import { ProductType, QuotaContext } from '@rhoas/app-services-ui-shared';
import {DownloadArtifacts} from './DownloadArtifacts';

export const ServiceRegistryPage: React.FunctionComponent = () => {
  const config = useConfig();

  if (config?.serviceDown) {
    return <ServiceDownPage />;
  }

  return <ServiceRegistryPageConnected />;
};

export const ServiceRegistryPageConnected: React.FC = () => {
  const config = useConfig();
  const { getQuota } = useQuota(ProductType.srs);
  const { preCreateInstance, shouldOpenCreateModal } = useModalControl();

  // Wait for the config and the registry to load
  if (config === undefined) {
    return <AppServicesLoading />;
  }

  const getTokenEndPointUrl = () => {
    if (config) {
      return `${config.masSso.authServerUrl}/realms/${config.masSso.realm}/protocol/openid-connect/token`;
    }
    return undefined;
  };

  return (
    <DevelopmentPreview>
      <FederatedModule
        scope="srs"
        module="./ServiceRegistry"
        fallback={<AppServicesLoading />}
        render={(ServiceRegistryFederated) => {
          return (
            <QuotaContext.Provider value={{ getQuota }}>
              <ServiceRegistryFederated
                preCreateInstance={preCreateInstance}
                shouldOpenCreateModal={shouldOpenCreateModal}
                tokenEndPointUrl={getTokenEndPointUrl()}
                renderDownloadArtifacts={(registry:RegistryRest, downloadLabel?:string)=><DownloadArtifacts registry={registry} downloadLabel={downloadLabel}/>}
              />
            </QuotaContext.Provider>
          );
        }}
      />
    </DevelopmentPreview>
  );
};

export default ServiceRegistryPage;
