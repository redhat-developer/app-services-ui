import React from 'react';
import { Config, ConfigContext } from '@rhoas/app-services-ui-shared';
import configs from '../../../../config/config.json';
import { EnvironmentConfigs, filterConfig } from '@app/providers/config/utils';

declare const __webpack_public_path__: string;

export const EmbeddedConfigProvider: React.FunctionComponent = ({ children }) => {
  const [value, setValue] = React.useState<Config | undefined>(() => {
    const [c, fetchConfig] = filterConfig(configs.config as EnvironmentConfigs, configs.federatedModules);
    return fetchConfig ? undefined : c;
  });

  React.useEffect(() => {
    (async () => {
      if (value === undefined) {
        const r = await fetch(`${__webpack_public_path__}config.json`);
        const j = await r.json();
        const [c] = filterConfig(j.config, j.federatedModules);
        setValue(c);
      }
    })();
  }, []);
  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
};
