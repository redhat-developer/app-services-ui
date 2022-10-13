import { useState, useEffect, FunctionComponent } from "react";
import { FederatedApicurioComponent } from "@app/pages/ServiceRegistry/FederatedApicurioComponent";
import { SrsLayout } from "@app/pages/ServiceRegistry/SrsLayout";
import { useConfig, useAuth } from "@rhoas/app-services-ui-shared";
import { ServiceDownPage } from "@app/pages";
import { usePrincipal } from "@app/components";
import { AppServicesLoading } from "@rhoas/app-services-ui-components";
import { Registry } from "@rhoas/registry-management-sdk";

export const RolesPage: FunctionComponent = () => {
  const config = useConfig();

  if (config?.serviceDown) {
    return <ServiceDownPage />;
  }

  return <RolesPageConnected />;
};

const RolesPageConnected: FunctionComponent = () => {
  return (
    <SrsLayout
      breadcrumbId="srs.global_roles"
      render={(registry) => <RolesLayoutRender registry={registry} />}
    />
  );
};

const RolesLayoutRender: FunctionComponent<{
  registry: Registry;
}> = ({ registry }) => {
  const [currentlyLoggedInuser, setCurrentlyLoggedInuser] = useState<string>();
  const auth = useAuth();

  useEffect(() => {
    (async () => {
      await auth?.getUsername()?.then((user) => setCurrentlyLoggedInuser(user));
    })();
  }, [auth]);

  const { getAllPrincipals } = usePrincipal();

  if (registry === undefined || currentlyLoggedInuser === undefined) {
    return <AppServicesLoading />;
  }

  const principals = getAllPrincipals()?.filter(
    (p) => p.id !== currentlyLoggedInuser && p.id !== registry?.owner
  );

  return (
    <FederatedApicurioComponent
      registry={registry}
      module="./FederatedRolesPage"
      principals={principals}
    />
  );
};

export default RolesPage;
