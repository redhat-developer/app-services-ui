import { FunctionComponent, useContext } from "react";
import { ConfigContext } from "@rhoas/app-services-ui-shared";
import { ServiceDownPage } from "@app/pages";
import { FederatedModule } from "@app/components";
import { DevelopmentPreview } from "@rhoas/app-services-ui-components";

export const MicroFrontendNamePage: FunctionComponent = () => {
  const config = useContext(ConfigContext);

  if (config?.serviceDown) {
    return <ServiceDownPage />;
  }

  return <MicroFrontendNamePageConnected />;
};

export const MicroFrontendNamePageConnected: FunctionComponent = () => {
  return (
    <DevelopmentPreview>
      <FederatedModule
        scope="scopeName"
        module="./MicroFrontendName"
        render={(MicroFrontendName) => {
          return <MicroFrontendName />;
        }}
      />
    </DevelopmentPreview>
  );
};
