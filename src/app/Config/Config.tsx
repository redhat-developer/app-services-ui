import React from "react";

export type Config = {
  controlPlane: {
    serviceApiBasePath: string,
    amsBasePath: string
  }
  dataPlane: {
    keycloak: {
      authServerUrl: string,
      clientId: string,
      realm: string
    }
  }
  federatedModules: {
    strimziUI: FederatedModuleConfig
    mkUiFrontend: FederatedModuleConfig
    guides: FederatedModuleConfig
  }
};

export type FederatedModuleConfig = {
  basePath: string
  entryPoint: string
}

export const ConfigContext = React.createContext<Config | undefined>(undefined);

export type ConfigProviderProps = {
  configUrl: string
}

export const ConfigProvider: React.FunctionComponent<ConfigProviderProps> = ({ configUrl, children }) => {
  const [config, setConfig] = React.useState<Config | undefined>(undefined);
  React.useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    (async () => {
      console.log('Loading config');
      const response = await fetch(configUrl, { signal });
      const newConfig = await response.json();
      setConfig(newConfig);
      console.log('Done loading config', newConfig);
    })();

    return () => controller.abort();
  }, [configUrl]);

  return (
    <ConfigContext.Provider value={config}>
      {children}
    </ConfigContext.Provider>
  );
}
