import { FederatedApicurioComponent } from "@app/pages/ServiceRegistry/FederatedApicurioComponent";
import React from "react";
import { SrsLayout } from "@app/pages/ServiceRegistry/SrsLayout";

export const ArtifactVersionDetails: React.FunctionComponent = () => {
  return (
    <SrsLayout breadcrumbId="srs.artifacts_details" render={registry => (
      <FederatedApicurioComponent registry={registry} module="./FederatedArtifactVersionPage" />
    )}/>
  );
};
