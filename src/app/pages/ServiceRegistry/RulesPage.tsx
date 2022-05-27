import { FederatedApicurioComponent } from "@app/pages/ServiceRegistry/FederatedApicurioComponent";
import { SrsLayout } from "@app/pages/ServiceRegistry/SrsLayout";
import { useConfig } from "@rhoas/app-services-ui-shared";
import { ServiceDownPage } from "@app/pages";
import { FunctionComponent } from "react";

export const RulesPage: FunctionComponent = () => {
  const config = useConfig();

  if (config?.serviceDown) {
    return <ServiceDownPage />;
  }

  return <RulesPageConnected />;
};

const RulesPageConnected: FunctionComponent = () => {
  return (
    <SrsLayout
      breadcrumbId="srs.global_rules"
      render={(registry) => (
        <FederatedApicurioComponent
          registry={registry}
          module="./FederatedRulesPage"
        />
      )}
    />
  );
};

export default RulesPage;
