import React from "react";
import { FederatedModule } from "@app/components";
import { AppServicesLoading } from "@rhoas/app-services-ui-components";
import { useAuth, useBasename, useConfig } from "@rhoas/app-services-ui-shared";

const SmartEventsPage: React.FC = () => {
  const auth = useAuth();
  const config = useConfig();
  const basename = useBasename();

  return (
    <>
      <FederatedModule
        scope="smart_events"
        fallback={<AppServicesLoading />}
        module="./SmartEventsApp"
        render={(SmartEventsApp) => (
          <SmartEventsApp
            getToken={auth.smart_events.getToken}
            getUsername={auth.getUsername}
            apiBaseUrl={config.smart_events.apiBasePath}
            basename={basename.getBasename()}
          />
        )}
      />
    </>
  );
};

export default SmartEventsPage;
