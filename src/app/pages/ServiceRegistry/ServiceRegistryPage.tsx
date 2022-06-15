import { FC, FunctionComponent } from "react";
import { FederatedModule, KasModalLoader } from "@app/components";
import { ServiceDownPage } from "@app/pages";
import { useModalControl, useQuota } from "@app/hooks";
import {
  AppServicesLoading,
  DevelopmentPreview,
} from "@rhoas/app-services-ui-components";
import {
  ProductType,
  QuotaContext,
  useConfig,
} from "@rhoas/app-services-ui-shared";
import { Registry } from "@rhoas/registry-management-sdk";
import { ITermsConfig } from "@app/services";
import { DownloadArtifacts } from "./DownloadArtifacts";
import { useConstants } from "@app/providers/config/ServiceConstants";
import { useAuth } from "@app/providers/auth";

export const ServiceRegistryPage: FunctionComponent = () => {
  const config = useConfig();

  if (config?.serviceDown) {
    return <ServiceDownPage />;
  }

  return <ServiceRegistryPageConnected />;
};

export const ServiceRegistryPageConnected: FC = () => {
  const config = useConfig();
  const auth = useAuth();

  const constants = useConstants();
  const { getQuota } = useQuota(ProductType.srs);
  const { preCreateInstance, shouldOpenCreateModal } = useModalControl({
    eventCode: constants.serviceRegistry.ams.termsAndConditionsEventCode,
    siteCode: constants.serviceRegistry.ams.termsAndConditionsSiteCode,
  } as ITermsConfig);

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
                  tokenEndPointUrl={auth?.tokenEndPointUrl}
                  renderDownloadArtifacts={(
                    registry: Registry,
                    downloadLabel?: string
                  ) => (
                    <DownloadArtifacts
                      registry={registry}
                      downloadLabel={downloadLabel}
                    />
                  )}
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
