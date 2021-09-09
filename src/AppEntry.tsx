import React, { useState } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { init } from '@app/store';
import App from '@app/App';
import logger from 'redux-logger';
import getBaseName from '@app/utils/getBaseName';
import { InsightsType } from '@app/utils/insights';
import { KeycloakInstance } from 'keycloak-js';
import { Alert, AlertContext, AlertProps, Auth, AuthContext, useConfig } from '@bf2/ui-shared';
import { getKeycloakInstance, getMASSSOToken } from '@app/utils/keycloakAuth';
import { I18nextProvider } from 'react-i18next';
import appServicesi18n from '@app/i18n';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/';
import { Loading } from '@app/components/Loading/Loading';
import { EmbeddedConfigProvider } from "@app/providers/config/EmbeddedConfigContextProvider";
import { BrowserRouter, Route, useHistory } from "react-router-dom";

const AppWithKeycloak: React.FunctionComponent = () => {
  const insights: InsightsType = window['insights'];
  const config = useConfig();

  React.useEffect(() => {
    if (config != undefined) {
      const loadKeycloak = async () => {
        const keycloak = await getKeycloakInstance(
          {
            url: config.masSso.authServerUrl,
            clientId: config.masSso.clientId,
            realm: config.masSso.realm,
          },
          insights.chrome.auth?.getToken
        );
        setKeycloak(keycloak);
        setLoadingKeycloak(false);
      };
      loadKeycloak();
    }
  }, [config, insights.chrome.auth]);

  const [keycloak, setKeycloak] = useState<KeycloakInstance | undefined>(undefined);
  const [loadingKeycloak, setLoadingKeycloak] = useState(true);

  const dispatch = useDispatch();

  if (loadingKeycloak || keycloak === undefined) {
    return <Loading/>;
  }

  const getToken = () => {
    return getMASSSOToken(insights.chrome.auth.getToken);
  };

  const auth: Auth = {
    getUsername: () => insights.chrome.auth.getUser().then((value) => value.identity.user.username),
    isOrgAdmin: () => insights.chrome.auth.getUser().then((value) => value.identity.user.is_org_admin),
    kafka: {
      getToken,
    },
    kas: {
      getToken: insights.chrome.auth.getToken,
    },
    ams: {
      getToken: insights.chrome.auth.getToken,
    },
    srs: {
      getToken: insights.chrome.auth.getToken,
    },
    apicurio_registry: {
      getToken,
    },
  };

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

  const DebugRouter = ({ children }: { children: any }) => {
    const { location } = useHistory();
    console.log(
      `Route: ${location.pathname}${location.search}, State: ${JSON.stringify(location.state)}`);
    return children
  }

  const baseName = getBaseName(window.location.pathname);
  return (
    <AuthContext.Provider value={auth}>
      <AlertContext.Provider value={alert}>
        <BrowserRouter basename={baseName}>
          <Route render={() => {
            return <DebugRouter>
              <App/>
            </DebugRouter>
          }}/>
        </BrowserRouter>
      </AlertContext.Provider>
    </AuthContext.Provider>
  );
};

const AppEntry: React.FunctionComponent = () => (
  <Provider store={init(logger).getStore()}>
    <I18nextProvider i18n={appServicesi18n}>
      <EmbeddedConfigProvider>
        <AppWithKeycloak/>
      </EmbeddedConfigProvider>
    </I18nextProvider>
  </Provider>
);
export default AppEntry;
