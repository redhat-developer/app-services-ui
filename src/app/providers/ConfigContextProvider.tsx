import React from "react";
import { Config, ConfigContext } from '@bf2/ui-shared';

const defaultHostname = "cloud.redhat.com";

export type EnviromentConfigs = [
  {
    hostnames: string[],
    config: Config
  }
];


export type ConfigProviderProps = {
  configUrl: string
}

export const ConfigProvider: React.FunctionComponent<ConfigProviderProps> = ({ configUrl, children }) => {
  const [config, setConfig] = React.useState<Config | undefined>(undefined);
  React.useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    (async () => {
      const hostname = window.location.hostname;
      console.log(`Loading config for ${hostname}`);
      const response = await fetch(configUrl, { signal });
      const environmentConfig = await response.json() as EnviromentConfigs;
      const possibleConfigs = environmentConfig.filter(entry => entry.hostnames.includes(hostname))
      if (possibleConfigs.length > 1) {
        throw new Error(`Unable to load config for ${hostname}, more than one config matched ${possibleConfigs}`);
      } else if (possibleConfigs.length < 1) {
        // Use the default config
        const possibleDefaultConfigs = environmentConfig.filter(entry => entry.hostnames.includes(defaultHostname))
        if (possibleDefaultConfigs.length > 1) {
          throw new Error(`Unable to load default config, more than one config matched ${possibleConfigs}`);
        } else if (possibleDefaultConfigs.length < 1) {
          throw new Error(`Unable to load default config, no configs matched`);
        } else {
          setConfig(possibleDefaultConfigs[0].config);
          console.log('Done loading default config', possibleDefaultConfigs[0]);
        }
      } else {
        setConfig(possibleConfigs[0].config);
        console.log('Done loading config', possibleConfigs[0].config);
      }
    })();

    return () => controller.abort();
  }, [configUrl]);

  return (
    <ConfigContext.Provider value={config}>
      {children}
    </ConfigContext.Provider>
  );
}
