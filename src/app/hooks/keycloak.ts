import Keycloak, { KeycloakConfig, KeycloakInstance } from "keycloak-js";
import { Auth, Config, useConfig } from "@rhoas/app-services-ui-shared";
import { getAccessToken, initKeycloak } from "@app/utils";

import { useInsights } from "@app/hooks/insights";
import { useEffect } from "react";

const init = async (config: Config, getInsightsAccessToken: () => Promise<string>) => {
  const keycloakConfig = {
    url: config.masSso.authServerUrl,
    clientId: config.masSso.clientId,
    realm: config.masSso.realm,
  } as KeycloakConfig;
  return await initKeycloak(keycloakConfig, getInsightsAccessToken);
}

let keycloakInstance;

const insightsChromeAuth = window["insights"].chrome.auth;

const preheatKeycloak = ()=>{
  const tempConfig = {
    "masSso":{
      "authServerUrl": "https://identity.api.stage.openshift.com/auth",
      "clientId": "strimzi-ui",
      "realm": "rhoas"
    }
  } as Config

  init(tempConfig, insightsChromeAuth.getToken).
  then(instance=>{keycloakInstance = instance}).catch(e=>{console.error(e)});
}

preheatKeycloak();

export const useAuth = (): Auth => {

  const config = useConfig();
  const insights = useInsights();

  if (config === undefined || insights.chrome.auth === undefined) {
    throw new Error("useAuth must be used inside a config provider, and insights auth");
  }
  const insightsChromeAuth = insights.chrome.auth;


  const getKeycloakInstance = async () => {
    return keycloakInstance
  }

  useEffect(() => {
    // Start loading keycloak immediately
   getKeycloakInstance();
  }, [config, insightsChromeAuth]);

  const getMASSSOToken = async () => {
    const keycloakInstance = await getKeycloakInstance();
    return getAccessToken(keycloakInstance, insightsChromeAuth.getToken)
  };

  const getUsername = async () => {
    const user = await insightsChromeAuth.getUser();
    return user.identity.user.username;
  }

  const isOrgAdmin = async () => {
    const user = await insightsChromeAuth.getUser();
    return user.identity.user.is_org_admin;
  }

  const getToken = insightsChromeAuth.getToken;

  return {
    getUsername,
    isOrgAdmin,
    kafka: {
      getToken: getMASSSOToken,
    },
    kas: {
      getToken,
    },
    ams: {
      getToken,
    },
    srs: {
      getToken,
    },
    apicurio_registry: {
      getToken: getMASSSOToken,
    },
  };

}
