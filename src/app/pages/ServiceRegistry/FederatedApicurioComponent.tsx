import { FC, LazyExoticComponent, VoidFunctionComponent } from "react";
import {
  ConfigType,
  createApicurioConfig,
} from "@app/pages/ServiceRegistry/utils";
import { FederatedModule } from "@app/components";
import { useHistory, useParams } from "react-router-dom";
import { Registry } from "@rhoas/registry-management-sdk";
import {
  useAuth,
  useBasename,
  useConfig,
  Principal,
} from "@rhoas/app-services-ui-shared";
import { AppServicesLoading } from "@rhoas/app-services-ui-components";

export type FederatedApicurioComponentProps = {
  module: string;
  registry: Registry | undefined;
  topicName?: string;
  groupId?: string | null | undefined;
  version?: string;
  registryId?: string;
  basename?: string;
  fileName?: string;
  downloadLinkLabel?: string;
  principals?: Principal[];
};

type ServiceRegistryParams = {
  groupId: string;
  artifactId: string;
  version: string;
};

export const FederatedApicurioComponent: FC<
  FederatedApicurioComponentProps
> = ({ module, ...rest }) => {
  return (
    <FederatedModule
      scope="apicurio_registry"
      module={module}
      fallback={<AppServicesLoading />}
      render={(component) => (
        <ServiceAccountsPageConnected Component={component} {...rest} />
      )}
    />
  );
};

const ServiceAccountsPageConnected: VoidFunctionComponent<
  { Component: LazyExoticComponent<any> } & Omit<
    FederatedApicurioComponentProps,
    "module"
  >
> = ({ Component, registry, principals, ...rest }) => {
  let federateConfig: ConfigType;
  const auth = useAuth();
  const config = useConfig();
  const history = useHistory();
  const basename = useBasename();
  const getToken = auth?.apicurio_registry.getToken;

  let { groupId, artifactId, version } = useParams<ServiceRegistryParams>();
  groupId = decodeURIComponent(groupId);
  artifactId = decodeURIComponent(artifactId);
  version = decodeURIComponent(version);

  if (config === undefined || registry === undefined) {
    return <AppServicesLoading />;
  }

  if (getToken && basename) {
    federateConfig = createApicurioConfig(
      config,
      registry.registryUrl as string,
      `${basename.getBasename()}/t/${registry?.id}`,
      getToken,
      principals
    );
    return (
      <Component
        config={federateConfig}
        tenantId={registry.id}
        groupId={groupId}
        artifactId={artifactId}
        version={version}
        history={history}
        {...rest}
      />
    );
  }
  return null;
};
