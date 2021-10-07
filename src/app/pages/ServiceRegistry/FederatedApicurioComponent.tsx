import React, { useEffect, useState } from 'react';
import { ConfigType, createApicurioConfig } from '@app/pages/ServiceRegistry/utils';
import { FederatedModule } from '@app/components';
import { useHistory, useParams } from 'react-router-dom';
import { RegistryRest } from '@rhoas/registry-management-sdk';
import { Principal, useAuth, useBasename, useConfig } from '@rhoas/app-services-ui-shared';
import { AppServicesLoading } from "@rhoas/app-services-ui-components";
import { getPrincipals } from "@app/utils";


export type FederatedApicurioComponentProps = {
  module: string;
  registry: RegistryRest | undefined;
  topicName?:string;
  groupId?:string | null | undefined;
  version?:string;
  registryId?:string;
  basename?:string;
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
  const [principals, setPrincipals] = useState<Principal[] | undefined>();
  const { groupId, artifactId, version } = useParams<ServiceRegistryParams>();

  useEffect(() => {
    if (auth) {
      getPrincipals(auth, config).then((value: Principal[])=>{setPrincipals(value)})
    }
  }, [auth, config])

  if (config === undefined || registry === undefined) {
    return <AppServicesLoading/>;
  }

  if (getToken && basename) {
    federateConfig = createApicurioConfig(
      config,
      registry.registryUrl as string,
      `${basename.getBasename()}/t/${registry?.id}`,
      getToken,
      principals
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
