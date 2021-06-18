import React, { useContext } from "react";
import { useConfig } from "@bf2/ui-shared";
import { createApicurioConfig } from "@app/pages/ServiceRegistry/utils";
import { FederatedModule, Loading } from "@app/components";
import { useHistory, useParams } from "react-router-dom";
import { CurrentRegistryContext } from "@app/pages/ServiceRegistry/CurrentRegistryContext";

export type FederatedApicurioComponentProps = {
  module: string
};

type ServiceRegistryParams = {
  groupId: string;
  artifactId: string;
  version: string;
};

export const FederatedApicurioComponent: React.FC<FederatedApicurioComponentProps> = ({
                                                                                        module,
                                                                                      }) => {
  const config = useConfig();
  const history = useHistory();
  const registry = useContext(CurrentRegistryContext);
  const { groupId, artifactId, version } = useParams<ServiceRegistryParams>();

  if (config === undefined || registry === undefined) {
    return <Loading/>;
  }
  const federateConfig = createApicurioConfig(registry.registryUrl, "/sr");

  return (
    <FederatedModule
      scope="apicurio_registry"
      module={module}
      fallback={<Loading/>}
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
