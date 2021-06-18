import { FederatedApicurioComponent } from "@app/pages/ServiceRegistry/FederatedApicurioComponent";
import { Registry } from "@rhoas/registry-management-sdk";
import React from "react";
import { SrsLayout } from "@app/pages/ServiceRegistry/SrsLayout";


export const ArtifactRedirect: React.FunctionComponent = () => {
  return (
    <SrsLayout>
      <FederatedApicurioComponent module="./FederatedArtifactRedirectPage" />
    </SrsLayout>
  );
};
