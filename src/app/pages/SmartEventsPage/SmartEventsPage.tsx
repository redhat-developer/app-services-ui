import React, {
  LazyExoticComponent,
  useMemo,
  VoidFunctionComponent,
} from "react";
import { FederatedModule } from "@app/components";
import { AppServicesLoading } from "@rhoas/app-services-ui-components";
import { useAuth, useBasename, useConfig } from "@rhoas/app-services-ui-shared";

const SmartEventsPage: React.FC = () => {
  return (
    <FederatedModule
      scope="smart_events"
      fallback={<AppServicesLoading />}
      module="./SmartEventsApp"
      render={(SmartEventsApp) => (
        <SmartEventsPageConnected Component={SmartEventsApp} />
      )}
    />
  );
};

export default SmartEventsPage;

const SmartEventsPageConnected: VoidFunctionComponent<{
  Component: LazyExoticComponent<any>;
}> = ({ Component }) => {
  const {
    smart_events: { getToken },
    getUsername,
  } = useAuth();
  const config = useConfig();
  const { getBasename } = useBasename();

  const basename = getBasename();
  const apiBaseUrl = config.smart_events.apiBasePath;

  const props = useMemo<SmartEventsAppProps>(
    () => ({
      getToken,
      getUsername,
      apiBaseUrl,
      basename,
    }),
    [getToken, getUsername, apiBaseUrl, basename]
  );

  return <Component {...props} />;
};

type SmartEventsAppProps = {
  getToken: () => Promise<string> | undefined;
  getUsername: () => Promise<string> | undefined;
  apiBaseUrl: string;
  basename: string;
};
