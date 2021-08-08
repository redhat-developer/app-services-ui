import React from "react";
import { Config, ConfigContext } from '@bf2/ui-shared';
import { filterConfig } from "@app/providers/config/utils";

export type ConfigProviderProps = {
  configUrl: string
}

export const ConfigProvider: React.FunctionComponent<ConfigProviderProps> = ({ configUrl, children }) => {
  const [config, setConfig] = React.useState<Config | undefined>(undefined);
  React.useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    (async () => {

      const response = await fetch(configUrl, { signal });
      const configJson = await response.json();
      setConfig(filterConfig(configJson.config, configJson.federatedModules));
    })();

    return () => controller.abort();
  }, [configUrl]);

  return (
    <ConfigContext.Provider value={config}>
      {children}
    </ConfigContext.Provider>
  );
}
