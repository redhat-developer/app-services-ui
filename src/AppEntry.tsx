import React, { useContext } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { init } from '@app/store';
import App from '@app/App';
import logger from 'redux-logger';
import getBaseName from '@app/utils/getBaseName';
import { Alert, AlertContext, AlertProps, AuthContext, ConfigContext } from '@rhoas/app-services-ui-shared';
import { I18nextProvider } from 'react-i18next';
import appServicesi18n from '@app/i18n';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/';
import { EmbeddedConfigProvider } from '@app/providers/config/EmbeddedConfigContextProvider';
import { useAuth } from '@app/hooks';
import { ConstantContext } from '@app/providers/config/ServiceConstants';
import { FeatureFlagProvider } from '@app/providers/featureflags/FeatureFlags';
import { AppServicesLoading, ModalProvider } from '@rhoas/app-services-ui-components';
import { ServiceConstantsContextProvider } from '@app/providers/config/ServiceConstantsContextProvider';

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
    <I18nextProvider i18n={appServicesi18n}>
      <FeatureFlagProvider>
        <EmbeddedConfigProvider>
          <ServiceConstantsContextProvider>
            <AppWithConfig />
          </ServiceConstantsContextProvider>
        </EmbeddedConfigProvider>
      </FeatureFlagProvider>
    </I18nextProvider>
  </Provider>
));

export default AppEntry;
