import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { init } from '@app/store';
import App from '@app/App';
import logger from 'redux-logger';
import getBaseName from '@app/utils/getBaseName';
import { Alert, AlertContext, AuthContext, AlertProps } from '@rhoas/app-services-ui-shared';
import { I18nextProvider } from 'react-i18next';
import appServicesi18n from '@app/i18n';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/';
import { EmbeddedConfigProvider } from '@app/providers/config/EmbeddedConfigContextProvider';
import { useAuth } from '@app/hooks';

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
        <Router basename={baseName}>
          <App />
        </Router>
      </AlertContext.Provider>
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react/display-name
const AppEntry: React.FunctionComponent = React.memo(() => (
  <Provider store={init(logger).getStore()}>
    <I18nextProvider i18n={appServicesi18n}>
      <EmbeddedConfigProvider>
        <AppWithKeycloak />
      </EmbeddedConfigProvider>
    </I18nextProvider>
  </Provider>
));

export default AppEntry;
