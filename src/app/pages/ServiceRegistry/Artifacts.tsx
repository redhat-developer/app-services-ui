import { FederatedApicurioComponent } from "@app/pages/ServiceRegistry/FederatedApicurioComponent";
import React from "react";
import { SrsLayout } from "@app/pages/ServiceRegistry/SrsLayout";

export const Artifacts: React.FunctionComponent = () => {
  return (
    <SrsLayout render={registry => (
      <FederatedApicurioComponent module="./FederatedArtifactsPage" registry={registry}/>
    )} />
  );
};
