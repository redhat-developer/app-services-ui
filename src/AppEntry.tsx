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
import { Alert, AlertContext, Auth, AuthContext, useConfig } from '@bf2/ui-shared';
import { getKeycloakInstance, getValidAccessToken } from '@app/utils/keycloakAuth';
import { I18nextProvider } from 'react-i18next';
import appServicesi18n from '@app/i18n';
import { AlertVariant } from '@patternfly/react-core';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/';
import { Loading } from '@app/components/Loading/Loading';

declare const __webpack_public_path__: string;
/**
 * Remove after upgrade @bf2/ui-shared package
 */
export type AlertProps = {
  /**
   * Flag to automatically call `onDismiss` after `dismissDelay` runs out.
   */
  autoDismiss?: boolean;
  /**
   * Flag to show/hide notification close button.
   */
  dismissable?: boolean;
  /**
   * Alert variant
   */
  variant: AlertVariant;
  /**
   * Alert title
   */
  title: string;
  /**
   * Alert description
   */
  description?: string | React.ReactElement;
  /**
   * Time period after which `onDismiss` is called.
   */
  dismissDelay?: number;
  /**
   * Unique request ID.
   */
  requestId?: string;
  /**
   * Unique sentry error ID.
   */
  sentryId?: string;
  /**
   * data-testid attribute
   */
  dataTestId?: string;
};

const AppWithKeycloak: React.FunctionComponent = () => {
  const config = useConfig();

  React.useEffect(() => {
    if (config != undefined) {
      const loadToken = async () => {
        const keycloak = await getKeycloakInstance({
          url: config.masSso.authServerUrl,
          clientId: config.masSso.clientId,
          realm: config.masSso.realm,
        });
        setKeycloak(keycloak);
        setLoadingKeycloak(false);
      };
      loadToken();
    }
  }, [config]);

  const [keycloak, setKeycloak] = useState<KeycloakInstance | undefined>(undefined);
  const [loadingKeycloak, setLoadingKeycloak] = useState(true);

  const dispatch = useDispatch();

  if (loadingKeycloak || keycloak === undefined) {
    return <Loading />;
  }

  const insights: InsightsType = window['insights'];

  const getToken = () => {
    return getValidAccessToken();
  };

  const auth: Auth = {
    getUsername: () => insights.chrome.auth.getUser().then((value) => value.identity.user.username),
    kafka: {
      getToken,
    },
    kas: {
      getToken: insights.chrome.auth.getToken,
    },
    ams: {
      getToken: insights.chrome.auth.getToken,
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
