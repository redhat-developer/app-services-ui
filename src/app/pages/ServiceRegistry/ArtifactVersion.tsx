import { FederatedApicurioComponent } from "@app/pages/ServiceRegistry/FederatedApicurioComponent";
import React from "react";
import { SrsLayout } from "@app/pages/ServiceRegistry/SrsLayout";
import { useConfig } from "@rhoas/app-services-ui-shared";
import { ServiceDownPage } from "@app/pages";

export const ArtifactVersionDetails: React.FunctionComponent = () => {
  const config = useConfig();

  if (config?.serviceDown) {
    return <ServiceDownPage />;
  }

  return <ArtifactVersionDetailsConnected />;
};

const ArtifactVersionDetailsConnected: React.FunctionComponent = () => {
  return (
    <SrsLayout breadcrumbId="srs.artifacts_details" render={registry => (
      <FederatedApicurioComponent registry={registry} module="./FederatedArtifactVersionPage" />
    )}/>
  );
};

export default ArtifactVersionDetails;
