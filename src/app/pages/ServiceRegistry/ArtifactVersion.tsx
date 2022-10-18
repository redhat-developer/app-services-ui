import { useState, useEffect, FunctionComponent } from "react";
import { useParams } from "react-router-dom";
import { FederatedApicurioComponent } from "@app/pages/ServiceRegistry/FederatedApicurioComponent";
import { SrsLayout } from "@app/pages/ServiceRegistry/SrsLayout";
import { useConfig, useAuth } from "@rhoas/app-services-ui-shared";
import { ServiceDownPage } from "@app/pages";
import { AppServicesLoading } from "@rhoas/app-services-ui-components";
import { Registry } from "@rhoas/registry-management-sdk";

export const ArtifactVersionDetails: FunctionComponent = () => {
  const config = useConfig();

  if (config?.serviceDown) {
    return <ServiceDownPage />;
  }

  return <ArtifactVersionDetailsConnected />;
};

const ArtifactVersionDetailsConnected: FunctionComponent = () => {
  let { artifactId } = useParams<{ artifactId: string }>();
  artifactId = decodeURIComponent(artifactId);

  return (
    <SrsLayout
      breadcrumbId="srs.artifacts_details"
      artifactId={artifactId}
      render={(registry) => (
        <ArtifactVersionDetailsLayoutRender registry={registry} />
      )}
    />
  );
};

const ArtifactVersionDetailsLayoutRender: FunctionComponent<{
  registry: Registry;
}> = ({ registry }) => {
  const [currentlyLoggedInuser, setCurrentlyLoggedInuser] = useState<string>();
  const auth = useAuth();

  useEffect(() => {
    (async () => {
      await auth?.getUsername()?.then((user) => setCurrentlyLoggedInuser(user));
    })();
  }, [auth]);

  if (registry === undefined || currentlyLoggedInuser === undefined) {
    return <AppServicesLoading />;
  }

  return (
    <FederatedApicurioComponent
      registry={registry}
      module="./FederatedArtifactVersionPage"
    />
  );
};

export default ArtifactVersionDetails;
