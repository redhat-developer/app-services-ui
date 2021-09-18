import { KeycloakConfig, KeycloakInstance } from "keycloak-js";
import { Auth, Config, useConfig } from "@bf2/ui-shared";
import { getAccessToken, initKeycloak } from "@app/utils";
import { useEffect, useRef } from "react";
import { useInsights } from "@app/hooks/insights";

const init = async (config: Config, getInsightsAccessToken: () => Promise<string>) => {
  const keycloakConfig = {
    url: config.masSso.authServerUrl,
    clientId: config.masSso.clientId,
    realm: config.masSso.realm,
  } as KeycloakConfig;
  return await initKeycloak(keycloakConfig, getInsightsAccessToken);
}

export const useAuth = (): Auth => {
  const keycloakInstance = useRef<KeycloakInstance>();
  const config = useConfig();
  const insights = useInsights();

  if (config === undefined || insights.chrome.auth === undefined) {
    throw new Error("useAuth must be used inside a config provider, and insights auth");
  }

  const insightsChromeAuth = insights.chrome.auth;

  const getKeycloakInstance = async () => {
    const instance = keycloakInstance.current;
    if (instance === undefined) {
      const answer = await init(config, insightsChromeAuth.getToken);
      keycloakInstance.current = answer;
      return answer;
    }
    return instance;
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
