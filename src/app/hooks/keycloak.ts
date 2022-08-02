import { Auth, useConfig } from "@rhoas/app-services-ui-shared";
import { useInsights } from "@app/hooks/insights";

export const useAuth = (): Auth => {
  const config = useConfig();
  const insights = useInsights();

  if (config === undefined || insights.chrome.auth === undefined) {
    throw new Error(
      "useAuth must be used inside a config provider, and insights auth"
    );
  }

  const insightsChromeAuth = insights.chrome.auth;

  const getUsername = async () => {
    const user = await insightsChromeAuth.getUser();
    return user.identity.user.username;
  };

  const isOrgAdmin = async () => {
    const user = await insightsChromeAuth.getUser();
    return user.identity.user.is_org_admin;
  };

  const getToken = insightsChromeAuth.getToken;

  return {
    getUsername,
    isOrgAdmin,
    kafka: {
      getToken,
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
      getToken,
    },
    smart_events: {
      getToken,
    },
  };
};
