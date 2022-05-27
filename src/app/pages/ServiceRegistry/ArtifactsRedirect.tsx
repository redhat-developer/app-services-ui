import { FederatedApicurioComponent } from "@app/pages/ServiceRegistry/FederatedApicurioComponent";
import { SrsLayout } from "@app/pages/ServiceRegistry/SrsLayout";
import { useConfig } from "@rhoas/app-services-ui-shared";
import { ServiceDownPage } from "@app/pages";
import { FunctionComponent } from "react";

export const ArtifactRedirect: FunctionComponent = () => {
  const config = useConfig();

  if (config?.serviceDown) {
    return <ServiceDownPage />;
  }

  return <ArtifactRedirectConnected />;
};

const ArtifactRedirectConnected: FunctionComponent = () => {
  return (
    <SrsLayout
      render={(registry) => (
        <FederatedApicurioComponent
          registry={registry}
          module="./FederatedArtifactRedirectPage"
        />
      )}
    />
  );
};

export default ArtifactRedirect;
