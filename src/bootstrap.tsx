import React, {useState} from 'react';
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
import {KeycloakInstance} from "keycloak-js";

const AppWithKeycloak = () => {


  React.useEffect(() => {
    const loadToken = async () => {
      console.log("loading data plane keycloak")
      const keycloak = await getKeycloakInstance({
        authServerUrl: "https://keycloak-edge-redhat-rhoam-user-sso.apps.mas-sso-stage.1gzl.s1.devshift.org/auth",
        clientId: "strimzi-ui",
        realm: "mas-sso-staging"
      });
      console.log(keycloak?.authenticated);
      setLoadingKeycloak(false);
    }
    console.log("useEffect")
    loadToken();
  }, []);

  const [loadingKeycloak, setLoadingKeycloak] = useState(true);


  if (loadingKeycloak) {
    return <Loading />;
  }

  return (
    <Router basename={getBaseName(window.location.pathname)}>
      <App/>
    </Router>
  )
}


ReactDOM.render(
  <Provider store={init(logger).getStore()}>
    <InsightsContext.Provider value={window["insights"]}>
      <AppWithKeycloak />
    </InsightsContext.Provider>
  </Provider>, document.getElementById('root')
);

let keycloak;
