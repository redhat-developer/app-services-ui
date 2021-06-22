import { FederatedApicurioComponent } from "@app/pages/ServiceRegistry/FederatedApicurioComponent";
import React from "react";
import { SrsLayout } from "@app/pages/ServiceRegistry/SrsLayout";
import { useConfig } from "@bf2/ui-shared";
import { ServiceDownPage } from "@app/pages";

export const Rules: React.FunctionComponent = () => {
  const config = useConfig();

  if (config?.serviceDown) {
    return <ServiceDownPage />;
  }

  return <RulesConnected />;
};

const RulesConnected: React.FunctionComponent = () => {
  return (
    <SrsLayout breadcrumbId="srs.global_rules" render={registry => (
      <FederatedApicurioComponent registry={registry} module="./FederatedRulesPage"/>
    )}/>
  );
};
