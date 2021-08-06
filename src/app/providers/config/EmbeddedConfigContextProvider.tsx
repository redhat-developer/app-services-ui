import React from "react";
import { ConfigContext } from '@bf2/ui-shared';
import { config, federatedModules } from '../../../../config/config.json';
import { filterConfig } from "@app/providers/config/utils";


export const EmbeddedConfigProvider: React.FunctionComponent = ({ children }) => {
  return (
    <ConfigContext.Provider value={filterConfig(config, federatedModules)}>
      {children}
    </ConfigContext.Provider>
  );
}
