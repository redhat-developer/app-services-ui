import React, {useContext, useState} from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router} from 'react-router-dom';
import {Provider} from 'react-redux';
import {init} from '@app/store';
import App from '@app/App';
import logger from 'redux-logger';
import getBaseName from '@app/utils/getBaseName';
import {InsightsContext} from "@app/utils/insights";
import {getKeycloakInstance} from "@app/utils/keycloakAuth";
import {Loading} from "./Components/Loading/Loading";
import {ConfigContext, ConfigProvider} from "@app/Config/Config";

declare const __PUBLIC_PATH__: string;

const AppWithKeycloak = () => {

  const config = useContext(ConfigContext)

  React.useEffect(() => {
    const loadToken = async () => {
      const keycloak = await getKeycloakInstance({
        authServerUrl: config.dataPlane.keycloak.authServerUrl,
        clientId: config.dataPlane.keycloak.clientId,
        realm: config.dataPlane.keycloak.realm
      });
      console.log(keycloak?.authenticated);
      setLoadingKeycloak(false);
    }
    loadToken();
  }, [config]);

  const [loadingKeycloak, setLoadingKeycloak] = useState(true);


  if (loadingKeycloak) {
    return <Loading/>;
  }

  return (
    <Router basename={getBaseName(window.location.pathname)}>
      <App/>
    </Router>
  )
}


ReactDOM.render(
  <Provider store={init(logger).getStore()}>
    <ConfigProvider configUrl={`${__PUBLIC_PATH__}config.json`}>
      <InsightsContext.Provider value={window["insights"]}>
        <AppWithKeycloak/>
      </InsightsContext.Provider>
    </ConfigProvider>
  </Provider>, document.getElementById('root')
);

let keycloak;
