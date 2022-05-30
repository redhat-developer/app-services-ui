import { useCallback, useEffect, useRef, useState } from "react";
import { KeycloakConfig, KeycloakInstance } from "keycloak-js";
import { Auth, Config, useConfig } from "@rhoas/app-services-ui-shared";
import { getAccessToken, initKeycloak } from "@app/utils";
import { useInsights, useSSOProviders } from "@app/hooks";
import { SsoProviderAllOf } from "@rhoas/kafka-management-sdk";

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

export const useAuth = (): Auth => {
  //states
  const [ssoProviders, setSSOProviders] = useState<SsoProviderAllOf>();

  const keycloakInstance = useRef<KeycloakInstance>();
  const config = useConfig();
  const insights = useInsights();
  const getSSOProviders = useSSOProviders();

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
    (async () => {
      const response = await getSSOProviders();
      setSSOProviders(response);
    })();
  }, [getSSOProviders]);

  useEffect(() => {
    // Start loading keycloak immediately
    getKeycloakInstance();
  }, [config, getKeycloakInstance, insightsChromeAuth]);

  const getToken = insightsChromeAuth.getToken;

  const getMASSSOToken = async () => {
    //return sso token if provider name is not mas_sso
    if (ssoProviders && ssoProviders?.name !== "mas_sso") {
      return getToken();
    }
    const keycloakInstance = await getKeycloakInstance();
    return getAccessToken(keycloakInstance, insightsChromeAuth.getToken);
  };

  const getUsername = async () => {
    const user = await insightsChromeAuth.getUser();
    return user.identity.user.username;
  };

  const isOrgAdmin = async () => {
    const user = await insightsChromeAuth.getUser();
    return user.identity.user.is_org_admin;
  };

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
    smart_events: {
      getToken,
    },
    tokenEndPointUrl: ssoProviders?.token_url,
  };
};
