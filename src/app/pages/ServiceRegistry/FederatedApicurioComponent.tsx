import React from 'react';
import { useAuth, useBasename, useConfig } from '@rhoas/app-services-ui-shared';
import { ConfigType, createApicurioConfig } from '@app/pages/ServiceRegistry/utils';
import { FederatedModule } from '@app/components';
import { useHistory, useParams } from 'react-router-dom';
import { RegistryRest } from '@rhoas/registry-management-sdk';
import { AppServicesLoading } from "@rhoas/app-services-ui-components";

export type FederatedApicurioComponentProps = {
  module: string;
  registry: RegistryRest;
  instanceName?:string;
  downloadLinkLabel?:string;
};

type ServiceRegistryParams = {
  groupId: string;
  artifactId: string;
  version: string;
};

export const FederatedApicurioComponent: React.FC<FederatedApicurioComponentProps> = ({ module, registry, ...rest }) => {
  let federateConfig: ConfigType;
  const auth = useAuth();
  const config = useConfig();
  const history = useHistory();
  const basename = useBasename();
  const getToken = auth?.apicurio_registry.getToken;
  const { groupId, artifactId, version } = useParams<ServiceRegistryParams>();

  if (config === undefined || registry === undefined) {
    return <AppServicesLoading/>;
  }

  if (getToken && basename && registry?.registryUrl) {
    federateConfig = createApicurioConfig(
      registry.registryUrl,
      `${basename.getBasename()}/t/${registry?.id}`,
      getToken
    );
  }

  return (
    <FederatedModule
      scope="apicurio_registry"
      module={module}
      fallback={<AppServicesLoading/>}
      render={(ServiceRegistryFederated) => {
        return (
          <ServiceRegistryFederated
            config={federateConfig}
            tenantId={registry.id}
            groupId={groupId}
            artifactId={artifactId}
            version={version}
            history={history}
            {...rest}
          />
        );
      }}
    />
  );
};
