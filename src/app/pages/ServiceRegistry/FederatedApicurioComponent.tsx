import React from 'react';
import { useBasename, useConfig, useAuth } from '@bf2/ui-shared';
import { createApicurioConfig, ConfigType } from '@app/pages/ServiceRegistry/utils';
import { FederatedModule, Loading } from '@app/components';
import { useHistory, useParams } from 'react-router-dom';
import { Registry } from '@rhoas/registry-management-sdk';

export type FederatedApicurioComponentProps = {
  module: string;
  registry: Registry;
};

type ServiceRegistryParams = {
  groupId: string;
  artifactId: string;
  version: string;
};

export const FederatedApicurioComponent: React.FC<FederatedApicurioComponentProps> = ({ module, registry }) => {
  const auth = useAuth();
  const config = useConfig();
  const history = useHistory();
  const basename = useBasename();
  const { groupId, artifactId, version } = useParams<ServiceRegistryParams>();

  if (config === undefined || registry === undefined) {
    return <Loading />;
  }

  const federateConfig: ConfigType = createApicurioConfig(
    registry.registryUrl,
    `${basename.getBasename()}/t/${registry?.id}`,
    auth?.apicurio_registry.getToken
  );

  return (
    <FederatedModule
      scope="apicurio_registry"
      module={module}
      fallback={<Loading />}
      render={(ServiceRegistryFederated) => {
        return (
          <ServiceRegistryFederated
            config={federateConfig}
            tenantId={registry.id}
            groupId={groupId}
            artifactId={artifactId}
            version={version}
            history={history}
          />
        );
      }}
    />
  );
};
