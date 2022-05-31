import {
  FunctionComponent,
  memo,
  useContext,
  useEffect,
  useState,
} from "react";
import { Provider, useDispatch } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import logger from "redux-logger";
import { inspect } from "@xstate/inspect";
import App from "@app/App";
import { useAuth, useSSOProviders } from "@app/hooks";
import { EmbeddedConfigProvider } from "@app/providers/config/EmbeddedConfigContextProvider";
import { ServiceConstantsContextProvider } from "@app/providers/config/ServiceConstantsContextProvider";
import { FeatureFlagProvider } from "@app/providers/featureflags/FeatureFlags";
import { init } from "@app/store";
import getBaseName from "@app/utils/getBaseName";
import { addNotification } from "@redhat-cloud-services/frontend-components-notifications";
import {
  AppServicesLoading,
  I18nProvider,
  ModalProvider,
} from "@rhoas/app-services-ui-components";
import {
  Alert,
  AlertContext,
  AlertProps,
  AuthContext as SharedAuthContext,
  ConfigContext,
} from "@rhoas/app-services-ui-shared";
import { SsoProviderAllOf } from "@rhoas/kafka-management-sdk";
import "@rhoas/app-services-ui-components/dist/esm/index.css";
import { AuthContext } from "@app/providers/auth";

if (window.localStorage.getItem("xstate-inspect") !== null) {
  inspect({
    iframe: false, // open in new window
  });
}

const AppWithKeycloak: FunctionComponent = () => {
  const [ssoProviders, setSSOProviders] = useState<SsoProviderAllOf>();
  const [isFetchingSSOProviders, setIsFetchingSSOProviders] =
    useState<boolean>();

  console.log("starting appwithkeycloak");
  let auth = useAuth();
  const dispatch = useDispatch();
  const getSSOProviders = useSSOProviders();

  useEffect(() => {
    (async () => {
      setIsFetchingSSOProviders(true);
      const response = await getSSOProviders();
      setIsFetchingSSOProviders(false);
      setSSOProviders(response);
    })();
  }, [getSSOProviders]);

  const shouldUseMasSSO = (): boolean => {
    return ssoProviders?.name === "mas_sso";
  };

  /**
   * This is temporary check.
   * It will be removed when we will have mas_sso to sso migration fully deployed
   */
  if (isFetchingSSOProviders === false && !shouldUseMasSSO()) {
    const {
      kas: { getToken },
    } = auth;
    auth = {
      ...auth,
      kafka: { getToken },
      apicurio_registry: { getToken },
    };
  }

  const addAlert = ({
    title,
    variant,
    description,
    dataTestId,
    autoDismiss,
    dismissable,
    dismissDelay,
    requestId,
    sentryId,
  }: AlertProps) => {
    dispatch(
      addNotification({
        title,
        variant,
        description,
        dataTestId,
        autoDismiss: autoDismiss || true,
        dismissable: dismissable || true,
        dismissDelay: dismissDelay || 8000,
        requestId,
        sentryId,
      })
    );
  };

  const alert: Alert = {
    addAlert,
  };

  const baseName = getBaseName(window.location.pathname);
  const { kas, kafka, getUsername, isOrgAdmin } = auth;

  return (
    <SharedAuthContext.Provider value={auth}>
      <AuthContext.Provider
        value={{
          getToken: kas.getToken,
          getMASSSOToken: kafka.getToken,
          getUsername,
          isOrgAdmin,
          tokenEndPointUrl: ssoProviders?.token_url,
        }}
      >
        <AlertContext.Provider value={alert}>
          <ModalProvider>
            <Router basename={baseName}>
              <App />
            </Router>
          </ModalProvider>
        </AlertContext.Provider>
      </AuthContext.Provider>
    </SharedAuthContext.Provider>
  );
};

const AppWithConfig: FunctionComponent = () => {
  const config = useContext(ConfigContext);
  if (config === undefined) {
    return <AppServicesLoading />;
  }
  return <AppWithKeycloak />;
};

const AppEntry: FunctionComponent = memo(() => (
  <Provider store={init(logger).getStore()}>
    <I18nProvider
      lng={"en"}
      resources={{
        en: {
          common: () =>
            import("@rhoas/app-services-ui-components/locales/en/common.json"),
          "create-kafka-instance": () =>
            import(
              "@rhoas/app-services-ui-components/locales/en/create-kafka-instance.json"
            ),
          "create-kafka-instance-with-sizes": () =>
            import(
              "@rhoas/app-services-ui-components/locales/en/create-kafka-instance-with-sizes.json"
            ),
          kafka: () =>
            import("@rhoas/app-services-ui-components/locales/en/kafka.json"),
          metrics: () =>
            import("@rhoas/app-services-ui-components/locales/en/metrics.json"),
          overview: () =>
            import(
              "@rhoas/app-services-ui-components/locales/en/overview.json"
            ),
          datascienceoverview: () =>
            import(
              "@rhoas/app-services-ui-components/locales/en/datascienceoverview.json"
            ),
          apimgmtoverview: () =>
            import(
              "@rhoas/app-services-ui-components/locales/en/apimgmtoverview.json"
            ),
          kafkaoverview: () =>
            import(
              "@rhoas/app-services-ui-components/locales/en/kafkaoverview.json"
            ),
          "message-browser": () =>
            import(
              "@rhoas/app-services-ui-components/locales/en/message-browser.json"
            ),
          // temporary translations until all user facing visuals are ported to the ui components repo
          appTemporaryFixMe: () => import("./locales/app-services-ui.json"),
          kafkaTemporaryFixMe: () => import("./locales/kafka-ui.json"),
          kasTemporaryFixMe: () => import("./locales/kas-ui.json"),
          srsTemporaryFixMe: () => import("./locales/srs-ui.json"),
          "manage-kafka-permissions": () =>
            import(
              "@rhoas/app-services-ui-components/locales/en/manage-kafka-permissions.json"
            ),
          "overview-v2": () =>
            import(
              "@rhoas/app-services-ui-components/locales/en/overview-v2.json"
            ),
          "kafkaoverview-v2": () =>
            import(
              "@rhoas/app-services-ui-components/locales/en/kafkaoverview-v2.json"
            ),
        },
      }}
      debug={true}
    >
      <FeatureFlagProvider>
        <EmbeddedConfigProvider>
          <ServiceConstantsContextProvider>
            <AppWithConfig />
          </ServiceConstantsContextProvider>
        </EmbeddedConfigProvider>
      </FeatureFlagProvider>
    </I18nProvider>
  </Provider>
));

export default AppEntry;
