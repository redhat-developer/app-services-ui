import { FC, LazyExoticComponent, VoidFunctionComponent } from "react";
import { useParams } from "react-router-dom";
import { Registry } from "@rhoas/registry-management-sdk";
import { FederatedApicurioComponent } from "./FederatedApicurioComponent";
import { FederatedModule } from "@app/components";
import { AppServicesLoading } from "@rhoas/app-services-ui-components";

export const ServiceRegistrySchemaMapping: FC = () => {
  return (
    <>
      <FederatedModule
        scope="srs"
        module="./ServiceRegistryMapping"
        fallback={<AppServicesLoading />}
        render={(component) => (
          <ServiceRegistrySchemaMappingConnected Component={component} />
        )}
      />
    </>
  );
};

const ServiceRegistrySchemaMappingConnected: VoidFunctionComponent<{
  Component: LazyExoticComponent<any>;
}> = ({ Component }) => {
  const { topicName } = useParams<{ topicName: string }>();
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
