import React from "react";

export type Config = {
  controlPlane: {
    serviceApiBasePath: string
  }
};

export const ConfigContext = React.createContext({} as Config);

export function ConfigProvider({ configUrl, children }) {
  const [config, setConfig] = React.useState({} as Config);
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
