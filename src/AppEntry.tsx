import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { init } from '@app/store';
import App from '@app/App';
import logger from 'redux-logger';
import getBaseName from '@app/utils/getBaseName';
import { InsightsType } from '@app/utils/insights';
import { ConfigProvider } from '@app/providers/ConfigContextProvider';
import { KeycloakInstance } from 'keycloak-js';
import { Alert, AlertContext, Auth, AuthContext, useConfig, AlertProps } from '@bf2/ui-shared';
import { getKeycloakInstance, getMASSSOToken } from '@app/utils/keycloakAuth';
import { I18nextProvider } from 'react-i18next';
import appServicesi18n from '@app/i18n';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/';
import { Loading } from '@app/components/Loading/Loading';

declare const __webpack_public_path__: string;

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
    return <Loading />;
  }

  const getToken = () => {
    return getMASSSOToken(insights.chrome.auth.getToken);
  };

  const auth: Auth = {
    getUsername: () => insights.chrome.auth.getUser().then((value) => value.identity.user.username),
    getIsOrgAdmin: () => insights.chrome.auth.getUser().then((value) => value.identity.user.is_org_admin),
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

  const baseName = getBaseName(window.location.pathname);
  return (
    <AuthContext.Provider value={auth}>
      <AlertContext.Provider value={alert}>
        <Router basename={baseName}>
          <App />
        </Router>
      </AlertContext.Provider>
    </AuthContext.Provider>
  );
};

const AppEntry: React.FunctionComponent = () => (
  <Provider store={init(logger).getStore()}>
    <I18nextProvider i18n={appServicesi18n}>
      <ConfigProvider configUrl={`${__webpack_public_path__}config.json`}>
        <AppWithKeycloak />
      </ConfigProvider>
    </I18nextProvider>
  </Provider>
);
export default AppEntry;
