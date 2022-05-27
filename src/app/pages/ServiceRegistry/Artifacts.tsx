import { FederatedApicurioComponent } from "@app/pages/ServiceRegistry/FederatedApicurioComponent";
import { SrsLayout } from "@app/pages/ServiceRegistry/SrsLayout";
import { useConfig } from "@rhoas/app-services-ui-shared";
import { ServiceDownPage } from "@app/pages";
import { FunctionComponent } from "react";

export const Artifacts: FunctionComponent = () => {
  const config = useConfig();

  if (config?.serviceDown) {
    return <ServiceDownPage />;
  }

  return <ArtifactsConnected />;
};

const ArtifactsConnected: FunctionComponent = () => {
  return (
    <SrsLayout
      breadcrumbId="srs.artifacts"
      render={(registry) => (
        <FederatedApicurioComponent
          module="./FederatedArtifactsPage"
          registry={registry}
        />
      )}
    />
  );
};

export default Artifacts;
