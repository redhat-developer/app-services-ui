import React, {useContext, useState} from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import {Provider} from 'react-redux';
import {init} from '@app/store';
import App from '@app/App';
import logger from 'redux-logger';
import getBaseName from '@app/utils/getBaseName';
import {InsightsContext} from "@app/utils/insights";
import {Loading} from "./app/Components/Loading/Loading";
import {ConfigContext, ConfigProvider} from "@app/Config/Config";
import {KeycloakInstance} from "keycloak-js";
import {AuthContext, IAuthContext} from "@app/utils/auth/AuthContext";
import {getKeycloakInstance, getKeyCloakToken} from "@app/utils/keycloakAuth";

declare const __PUBLIC_PATH__: string;

const AppWithKeycloak: React.FunctionComponent = () => {

  const config = useContext(ConfigContext)

  React.useEffect(() => {
    if (config != undefined) {
      const loadToken = async () => {
        const keycloak = await getKeycloakInstance ({
          url: config.dataPlane.keycloak.authServerUrl,
          clientId: config.dataPlane.keycloak.clientId,
          realm: config.dataPlane.keycloak.realm
        });
        setKeycloak(keycloak);
        setLoadingKeycloak(false);
      }
      loadToken();
    }
  }, [config]);

  const [keycloak, setKeycloak] = useState<KeycloakInstance | undefined>(undefined);
  const [loadingKeycloak, setLoadingKeycloak] = useState(true);


  if (loadingKeycloak || keycloak === undefined) {
    return <Loading/>;
  }

  const getToken = () => {
    return getKeyCloakToken();

  }

  const baseName = getBaseName(window.location.pathname);
  return (
    <AuthContext.Provider value={{
      getToken
    } as IAuthContext}>
      <Router basename={baseName}>
        <App/>
      </Router>
    </AuthContext.Provider>
  )
}


const AppEntry: React.FunctionComponent = () => (
  <Provider store={init(logger).getStore()}>
    <ConfigProvider configUrl={`${__PUBLIC_PATH__}config.json`}>
      <InsightsContext.Provider value={window["insights"]}>
        <AppWithKeycloak/>
      </InsightsContext.Provider>
    </ConfigProvider>
  </Provider>
);
export default AppEntry;

