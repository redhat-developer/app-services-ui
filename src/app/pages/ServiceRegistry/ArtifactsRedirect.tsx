import { FederatedApicurioComponent } from "@app/pages/ServiceRegistry/FederatedApicurioComponent";
import React from "react";
import { SrsLayout } from "@app/pages/ServiceRegistry/SrsLayout";
import { useConfig } from "@rhoas/app-services-ui-shared";
import { ServiceDownPage } from "@app/pages";

export const ArtifactRedirect: React.FunctionComponent = () => {
  const config = useConfig();

  if (config?.serviceDown) {
    return <ServiceDownPage />;
  }

  return <ArtifactRedirectConnected />;
};

const ArtifactRedirectConnected: React.FunctionComponent = () => {
  return (
    <SrsLayout render={registry => (
      <FederatedApicurioComponent registry={registry} module="./FederatedArtifactRedirectPage" />
    )} />
  );
};

export default ArtifactRedirect;
