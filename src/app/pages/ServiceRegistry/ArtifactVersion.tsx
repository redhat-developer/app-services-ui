import { useState, useEffect, FunctionComponent } from "react";
import { useParams } from "react-router-dom";
import { FederatedApicurioComponent } from "@app/pages/ServiceRegistry/FederatedApicurioComponent";
import { SrsLayout } from "@app/pages/ServiceRegistry/SrsLayout";
import { useConfig, useAuth } from "@rhoas/app-services-ui-shared";
import { ServiceDownPage } from "@app/pages";
import { usePrincipal } from "@app/components";
import { AppServicesLoading } from "@rhoas/app-services-ui-components";

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

  const [currentlyLoggedInuser, setCurrentlyLoggedInuser] = useState<string>();
  const auth = useAuth();
  const { getAllPrincipals } = usePrincipal();

  useEffect(() => {
    (async () => {
      await auth?.getUsername()?.then((user) => setCurrentlyLoggedInuser(user));
    })();
  }, [auth]);

  return (
    <SrsLayout
      breadcrumbId="srs.artifacts_details"
      artifactId={artifactId}
      render={(registry) => {
        if (registry === undefined || currentlyLoggedInuser === undefined) {
          return <AppServicesLoading />;
        }

        const principals = getAllPrincipals()?.filter(
          (p) => p.id !== currentlyLoggedInuser && p.id !== registry?.owner
        );

        return (
          <FederatedApicurioComponent
            registry={registry}
            module="./FederatedArtifactVersionPage"
            principals={principals}
          />
        );
      }}
    />
  );
};

export default ArtifactVersionDetails;
