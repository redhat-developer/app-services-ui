import React from 'react';
import { useConfig } from '@rhoas/app-services-ui-shared';
import { DevelopmentPreview, FederatedModule, KasModalLoader } from '@app/components';
import { ServiceDownPage } from '@app/pages';
import { useModalControl, useQuota, useMASToken } from '@app/hooks';
import { AppServicesLoading } from '@rhoas/app-services-ui-components';
import { ProductType, QuotaContext } from '@rhoas/app-services-ui-shared';
import { Registry } from '@rhoas/registry-management-sdk';
import { ITermsConfig } from '@app/services';
import { DownloadArtifacts } from './DownloadArtifacts';
import constantsConfig from '@configs/service-constants.json';

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
  const { preCreateInstance, shouldOpenCreateModal } = useModalControl({
    eventCode: termsConfig['service-registry'].EventCode,
    siteCode: termsConfig['service-registry'].SiteCode,
  } as ITermsConfig);
  const { getTokenEndPointUrl } = useMASToken();

  // Wait for the config and the registry to load
  if (config === undefined) {
    return <AppServicesLoading />;
  }

  return (
    <DevelopmentPreview>
      <FederatedModule
        scope="srs"
        module="./ServiceRegistry"
        fallback={<AppServicesLoading />}
        render={(ServiceRegistryFederated) => {
          return (
            <QuotaContext.Provider value={{ getQuota }}>
              <KasModalLoader>
                <ServiceRegistryFederated
                  preCreateInstance={preCreateInstance}
                  shouldOpenCreateModal={shouldOpenCreateModal}
                  tokenEndPointUrl={getTokenEndPointUrl()}
                  renderDownloadArtifacts={(registry:Registry, downloadLabel?:string)=><DownloadArtifacts registry={registry} downloadLabel={downloadLabel}/>}
                />
              </KasModalLoader>
            </QuotaContext.Provider>
          );
        }}
      />
    </DevelopmentPreview>
  );
};

export default ServiceRegistryPage;
