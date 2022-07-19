import { KeycloakConfig, KeycloakInstance } from "keycloak-js";
import { Auth, Config, useConfig } from "@rhoas/app-services-ui-shared";
import { getAccessToken, initKeycloak } from "@app/utils";
import { useCallback, useEffect, useRef } from "react";
import { useInsights } from "@app/hooks/insights";

const init = async (
  config: Config,
  getInsightsAccessToken: () => Promise<string>
) => {
  const keycloakConfig = {
    url: config.masSso.authServerUrl,
    clientId: config.masSso.clientId,
    realm: config.masSso.realm,
  } as KeycloakConfig;
  return await initKeycloak(keycloakConfig, getInsightsAccessToken);
};

export const useAuth = (): Auth & {
  getUserInfo: () => Promise<{
    username: string;
    email: string;
    firstName: string;
    lastName: string;
  }>;
} => {
  const keycloakInstance = useRef<KeycloakInstance>();
  const config = useConfig();
  const insights = useInsights();

  if (config === undefined || insights.chrome.auth === undefined) {
    throw new Error(
      "useAuth must be used inside a config provider, and insights auth"
    );
  }

  const insightsChromeAuth = insights.chrome.auth;

  const getKeycloakInstance = useCallback(async () => {
    const instance = keycloakInstance.current;
    if (instance === undefined) {
      const answer = await init(config, insightsChromeAuth.getToken);
      keycloakInstance.current = answer;
      return answer;
    }
    return instance;
  }, [config, insightsChromeAuth]);

  useEffect(() => {
    // Start loading keycloak immediately
    getKeycloakInstance();
  }, [config, getKeycloakInstance, insightsChromeAuth]);

  const getMASSSOToken = useCallback(async () => {
    const keycloakInstance = await getKeycloakInstance();
    return getAccessToken(keycloakInstance, insightsChromeAuth.getToken);
  }, [getKeycloakInstance, insightsChromeAuth.getToken]);

  const getUsername = useCallback(async () => {
    const user = await insightsChromeAuth.getUser();
    return user.identity.user.username;
  }, [insightsChromeAuth]);

  const getUserInfo = useCallback(async () => {
    const user = await insightsChromeAuth.getUser();
    const {
      username,
      email,
      first_name: firstName,
      last_name: lastName,
    } = user.identity.user;
    return {
      username,
      email,
      firstName,
      lastName,
    };
  }, [insightsChromeAuth]);

  const isOrgAdmin = useCallback(async () => {
    const user = await insightsChromeAuth.getUser();
    return user.identity.user.is_org_admin;
  }, [insightsChromeAuth]);

  const getToken = insightsChromeAuth.getToken;

  return {
    getUsername,
    getUserInfo,
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
    smart_events: {
      getToken,
    },
  };
};
