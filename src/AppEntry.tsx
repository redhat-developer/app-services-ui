import App from '@app/App';
import { useAuth } from '@app/hooks';
import { EmbeddedConfigProvider } from '@app/providers/config/EmbeddedConfigContextProvider';
import { ServiceConstantsContextProvider } from '@app/providers/config/ServiceConstantsContextProvider';
import { FeatureFlagProvider } from '@app/providers/featureflags/FeatureFlags';
import { init } from '@app/store';
import getBaseName from '@app/utils/getBaseName';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/';
import { AppServicesLoading, I18nProvider, ModalProvider } from '@rhoas/app-services-ui-components';
import { Alert, AlertContext, AlertProps, AuthContext, ConfigContext } from '@rhoas/app-services-ui-shared';
import React, { useContext } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import logger from 'redux-logger';

import '@rhoas/app-services-ui-components/dist/esm/index.css';

const AppWithKeycloak: React.FunctionComponent = () => {
  console.log('starting appwithkeycloak');
  const auth = useAuth();
  const dispatch = useDispatch();

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
        <ModalProvider>
          <Router basename={baseName}>
            <App />
          </Router>
        </ModalProvider>
      </AlertContext.Provider>
    </AuthContext.Provider>
  );
};

const AppWithConfig: React.FunctionComponent = () => {
  const config = useContext(ConfigContext);
  if (config === undefined) {
    return <AppServicesLoading />;
  }
  return <AppWithKeycloak />;
};

// eslint-disable-next-line react/display-name
const AppEntry: React.FunctionComponent = React.memo(() => (
  <Provider store={init(logger).getStore()}>
    <I18nProvider
      lng={'en'}
      resources={{
        en: {
          common: () => import('@rhoas/app-services-ui-components/locales/en/common.json'),
          'create-kafka-instance': () =>
            import('@rhoas/app-services-ui-components/locales/en/create-kafka-instance.json'),
          kafka: () => import('@rhoas/app-services-ui-components/locales/en/kafka.json'),
          metrics: () => import('@rhoas/app-services-ui-components/locales/en/metrics.json'),
          overview: () => import('@rhoas/app-services-ui-components/locales/en/overview.json'),
          datascienceoverview: () => import('@rhoas/app-services-ui-components/locales/en/datascienceoverview.json'),
          apimgmtoverview: () => import('@rhoas/app-services-ui-components/locales/en/apimgmtoverview.json'),
          // temporary translations until all user facing visuals are ported to the ui components repo
          appTemporaryFixMe: () => import('./locales/app-services-ui.json'),
          kafkaTemporaryFixMe: () => import('./locales/kafka-ui.json'),
          kasTemporaryFixMe: () => import('./locales/kas-ui.json'),
          srsTemporaryFixMe: () => import('./locales/srs-ui.json'),
          "manage-kafka-permissions": () => import("@rhoas/app-services-ui-components/locales/en/manage-kafka-permissions.json"),
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
