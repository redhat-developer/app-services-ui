import { FederatedApicurioComponent } from "@app/pages/ServiceRegistry/FederatedApicurioComponent";
import React from "react";
import { SrsLayout } from "@app/pages/ServiceRegistry/SrsLayout";

export const Rules: React.FunctionComponent = () => {
  return (
    <SrsLayout breadcrumbId="srs.global_rules" render={registry => (
      <FederatedApicurioComponent registry={registry} module="./FederatedRulesPage"/>
    )}/>
  );
};
