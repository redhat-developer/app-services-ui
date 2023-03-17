import { LazyExoticComponent, useCallback, VoidFunctionComponent } from "react";
import { Registry } from "@rhoas/registry-management-sdk";
import { FederatedModule } from "@app/components";
import { AppServicesLoading } from "@rhoas/app-services-ui-components";
import { BasenameContext } from "@rhoas/app-services-ui-shared";
import { FederatedApicurioComponent } from "@app/pages/ServiceRegistry/FederatedApicurioComponent";
import { AppEntry } from "../AppEntry";

const getBasename = () => "";

export const TopicSchema: VoidFunctionComponent<{
  topicName: string;
}> = ({ topicName }) => {
  const render = useCallback(
    (component) => (
      <ServiceRegistrySchemaMappingConnected
        Component={component}
        topicName={topicName}
      />
    ),
    [topicName]
  );
  return (
    <AppEntry>
      <BasenameContext.Provider value={{ getBasename }}>
        <FederatedModule
          scope="srs"
          module="./ServiceRegistryMapping"
          fallback={<AppServicesLoading />}
          render={render}
        />
      </BasenameContext.Provider>
    </AppEntry>
  );
};

const ServiceRegistrySchemaMappingConnected: VoidFunctionComponent<{
  Component: LazyExoticComponent<any>;
  topicName: string;
}> = ({ Component, topicName }) => {
  const basename = "/service-registry";

  return (
    <Component
      basename={basename}
      topicName={topicName}
      renderSchema={(registry: Registry) => (
        <FederatedApicurioComponent
          module="./FederatedSchemaMapping"
          registry={registry}
          topicName={topicName}
          groupId={null}
          version={"latest"}
          registryId={registry?.id}
          basename={basename}
        />
      )}
    />
  );
};

export default TopicSchema;
