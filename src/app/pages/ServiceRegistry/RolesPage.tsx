import { FederatedApicurioComponent } from "@app/pages/ServiceRegistry/FederatedApicurioComponent";
import React from "react";
import { SrsLayout } from "@app/pages/ServiceRegistry/SrsLayout";
import { useConfig } from "@bf2/ui-shared";
import { ServiceDownPage } from "@app/pages";

export const RolesPage: React.FunctionComponent = () => {
  const config = useConfig();

  if (config?.serviceDown) {
    return <ServiceDownPage />;
  }

  return <RolesPageConnected />;
};

const RolesPageConnected: React.FunctionComponent = () => {
  return (
    <SrsLayout breadcrumbId="srs.global_roles" render={registry => (
      <FederatedApicurioComponent registry={registry} module="./FederatedRolesPage"/>
    )}/>
  );
};

export default RolesPage;
