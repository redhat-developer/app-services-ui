import { Principal } from '@rhoas/app-services-ui-shared';
import { Config } from "@rhoas/app-services-ui-shared";


export interface FeaturesConfig {
  readOnly?: boolean;
  breadcrumbs?: boolean;
  multiTenant?: boolean;
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
export interface NoneAuthConfig extends AuthConfig {}

export interface ConfigType {
  artifacts: ArtifactsConfig;
  auth: KeycloakJsAuthConfig | NoneAuthConfig;
  features?: FeaturesConfig;
  ui: UiConfig;
  principals?: Principal[];
}

const createApicurioConfig = (config: Config, apiUrl: string, navPathPrefix: string, getToken: () => Promise<string>, principals?: Principal[]) => {
  const apicurioConfig: ConfigType = {
    artifacts: {
      url: `${apiUrl}/apis/registry`,
    },
    auth: {
      type: 'gettoken',
      getToken,
    },
    features: {
      readOnly: false,
      breadcrumbs: false,
      roleManagement: config.srs.apiBasePath == "https://api.stage.openshift.com",
      multiTenant: true,
    },
    ui: {
      navPrefixPath: navPathPrefix,
    },
    principals
  } as ConfigType;

  return apicurioConfig;
};

export { createApicurioConfig };
