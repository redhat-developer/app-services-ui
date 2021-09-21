import React from "react";
import { ConfigContext } from '@bf2/ui-shared';
import config from '../../../../config/config.json';
import { EnvironmentConfigs, filterConfig } from "@app/providers/config/utils";


export const EmbeddedConfigProvider: React.FunctionComponent = ({ children }) => {
  const c = config.config as EnvironmentConfigs;
  return (
    <ConfigContext.Provider value={filterConfig(c, config.federatedModules)}>
      {children}
    </ConfigContext.Provider>
  );
}
