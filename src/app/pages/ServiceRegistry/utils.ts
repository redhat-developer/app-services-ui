import { Alert, Principal } from '@rhoas/app-services-ui-shared';
import { Config } from "@rhoas/app-services-ui-shared";

export interface FeaturesConfig {
  readOnly?: boolean;
  breadcrumbs?: boolean;
  multiTenant?: boolean;
  roleManagement?: boolean;
  settings?: boolean;
  alerts?: Alert;
}

export interface ArtifactsConfig {
  url: string;
}

export interface UiConfig {
  contextPath?: string;
  navPrefixPath?: string;
}

export interface AuthConfig {
  type: string;
  getToken: () => Promise<string>;
}

// Used when `type=keycloakjs`
export interface KeycloakJsAuthConfig extends AuthConfig {
  options?: any;
}

// Used when `type=none`
export type NoneAuthConfig = AuthConfig;

export interface ConfigType {
  artifacts: ArtifactsConfig;
  auth: KeycloakJsAuthConfig | NoneAuthConfig;
  features?: FeaturesConfig;
  ui: UiConfig;
  principals?: Principal[] | undefined;
}

const createApicurioConfig = (
  _config: Config,
  alert: Alert,
  apiUrl: string,
  navPathPrefix: string,
  getToken: () => Promise<string> | undefined,
  principals?: Principal[] | undefined
) => {
  const apicurioConfig: ConfigType = {
    artifacts: {
      url: `${apiUrl}/apis/registry`,
    },
    auth: {
      type: "gettoken",
      getToken,
    },
    features: {
      readOnly: false,
      breadcrumbs: false,
      roleManagement: true,
      multiTenant: true,
      settings: true,
      alerts: alert,
    },
    ui: {
      navPrefixPath: navPathPrefix,
    },
    principals,
  } as ConfigType;

  return apicurioConfig;
};

export { createApicurioConfig };
