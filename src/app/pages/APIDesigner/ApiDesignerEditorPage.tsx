import { FederatedModule } from "@app/components";
import { ServiceDownPage } from "@app/pages/ServiceDown/ServiceDownPage";
import { useConfig } from "@rhoas/app-services-ui-shared";
import { AppServicesLoading } from "@rhoas/app-services-ui-components";
import { FunctionComponent } from "react";
import { useParams } from "react-router-dom";

export const ApiDesignerEditorPage: FunctionComponent = () => {
  const config = useConfig();
  const params: any = useParams();

  if (config?.serviceDown) {
    return <ServiceDownPage />;
  }

  return (
    <FederatedModule
      scope="ads"
      fallback={<AppServicesLoading />}
      module="./FederatedEditorPage"
      render={(FederatedEditorPage) => <FederatedEditorPage params={params} />}
    />
  );
};

export default ApiDesignerEditorPage;
