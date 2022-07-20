import { FC, FunctionComponent } from "react";
import { FederatedModule, KasModalLoader } from "@app/components";
import { ServiceDownPage } from "@app/pages";
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
import { DownloadArtifacts } from "./DownloadArtifacts";
import { useAuth } from "@app/providers/auth";
import { withTermsAndConditions, useQuota, ServiceType } from "@app/hooks";

type ServiceRegistryPageProps = {
  preCreateInstance: (open: boolean) => Promise<boolean>;
  shouldOpenCreateModal: () => Promise<boolean>;
};

export const ServiceRegistryPage: FunctionComponent<any> = ({
  preCreateInstance,
  shouldOpenCreateModal,
}) => {
  const config = useConfig();

  if (config?.serviceDown) {
    return <ServiceDownPage />;
  }

  return (
    <ServiceRegistryPageConnected
      shouldOpenCreateModal={shouldOpenCreateModal}
      preCreateInstance={preCreateInstance}
    />
  );
};

export const ServiceRegistryPageConnected: FC<ServiceRegistryPageProps> = ({
  preCreateInstance,
  shouldOpenCreateModal,
}) => {
  const config = useConfig();
  const auth = useAuth();

  const { getQuota } = useQuota(ProductType.srs);

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

export default withTermsAndConditions(
  ServiceRegistryPage,
  ServiceType.SERVICE_REGISTRY
);
