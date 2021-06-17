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
}

// Used when `type=keycloakjs`
export interface KeycloakJsAuthConfig extends AuthConfig {
    options?: any;
}

// Used when `type=none`
export interface NoneAuthConfig extends AuthConfig {

}

// Used when `type=gettoken`
export interface GetTokenAuthConfig extends AuthConfig {
    getToken: () => string;
}

export interface ConfigType {
    artifacts: ArtifactsConfig;
    auth: KeycloakJsAuthConfig | NoneAuthConfig | GetTokenAuthConfig;
    features?: FeaturesConfig;
    ui: UiConfig;
}

const getNavPrefixPath = () => {
    const pathname = window.location.pathname;
    let release = '/';
    const pathName = pathname.split('/');
    pathName.shift();
    if (pathName[0] === 'beta') {
        pathName.shift();
        release = `/beta/`;
    }
    return `${release}application-services/sr`;
};

const federatedConfig = (apiUrl: string) => {
    const config: ConfigType = {
        artifacts: {
            url: `${apiUrl}/apis/registry`,
        },
        auth: {
            options: {},
            type: 'none',
        },
        features: {
            readOnly: false,
            breadcrumbs: false,
            multiTenant: true
        },
        ui: {
            navPrefixPath: getNavPrefixPath()
        }
    }

    return config;
}

export { federatedConfig, getNavPrefixPath };