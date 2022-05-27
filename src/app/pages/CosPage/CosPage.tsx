import { FederatedModule } from "@app/components";
import { ServiceDownPage } from "@app/pages/ServiceDown/ServiceDownPage";
import { useConfig } from "@rhoas/app-services-ui-shared";
import { AppServicesLoading } from "@rhoas/app-services-ui-components";
import { FunctionComponent } from "react";

export const CosPage: FunctionComponent = () => {
  const config = useConfig();

  if (config?.serviceDown) {
    return <ServiceDownPage />;
  }

  return (
    <FederatedModule
      scope="cos"
      fallback={<AppServicesLoading />}
      module="./OpenshiftManagedConnectors"
      render={(OpenshiftManagedConnectors) => <OpenshiftManagedConnectors />}
    />
  );
};

export default CosPage;
