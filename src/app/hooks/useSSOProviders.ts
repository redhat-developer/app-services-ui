import { useCallback } from "react";
import { useConfig } from "@rhoas/app-services-ui-shared";
import { SsoProviderAllOf } from "@rhoas/kafka-management-sdk";

export const useSSOProviders = () => {
  const config = useConfig();
  return useCallback(async (): Promise<SsoProviderAllOf> => {
    const response = await fetch(
      `${config.kas.apiBasePath}/api/kafkas_mgmt/v1/sso_providers`
    );
    return response.json();
  }, [config.kas.apiBasePath]);
};
