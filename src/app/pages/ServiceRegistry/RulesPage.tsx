import { FederatedApicurioComponent } from "@app/pages/ServiceRegistry/FederatedApicurioComponent";
import React from "react";
import { SrsLayout } from "@app/pages/ServiceRegistry/SrsLayout";
import { useConfig } from "@rhoas/app-services-ui-shared";
import { ServiceDownPage } from "@app/pages";

export const RulesPage: React.FunctionComponent = () => {
  const config = useConfig();

  if (config?.serviceDown) {
    return <ServiceDownPage />;
  }

  return <RulesPageConnected />;
};

const RulesPageConnected: React.FunctionComponent = () => {
  return (
    <SrsLayout breadcrumbId="srs.global_rules" render={registry => (
      <FederatedApicurioComponent registry={registry} module="./FederatedRulesPage"/>
    )}/>
  );
};

export default RulesPage;
