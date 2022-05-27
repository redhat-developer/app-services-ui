import { FunctionComponent } from "react";
import { FederatedApicurioComponent } from "@app/pages/ServiceRegistry/FederatedApicurioComponent";
import { SrsLayout } from "@app/pages/ServiceRegistry/SrsLayout";
import { useConfig } from "@rhoas/app-services-ui-shared";
import { ServiceDownPage } from "@app/pages";

export const SettingsPage: FunctionComponent = () => {
  const config = useConfig();

  if (config?.serviceDown) {
    return <ServiceDownPage />;
  }

  return <SettingsPageConnected />;
};

const SettingsPageConnected: FunctionComponent = () => {
  return (
    <SrsLayout
      breadcrumbId="srs.settings"
      render={(registry) => (
        <FederatedApicurioComponent
          registry={registry}
          module="./FederatedSettingsPage"
        />
      )}
    />
  );
};

export default SettingsPage;
