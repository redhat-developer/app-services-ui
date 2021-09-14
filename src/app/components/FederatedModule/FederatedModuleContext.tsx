import React from "react";
import { FederatedModuleConfig, useConfig } from "@rhoas/app-services-ui-shared";
import { Loading } from "@app/components";

export type FederatedModuleContextProps = {
  [module: string]: FederatedModuleConfig
}

export const FederatedModuleContext = React.createContext<FederatedModuleContextProps>({});

export const FederatedModuleProvider: React.FunctionComponent = ({ children }) => {

  const config = useConfig();

  if (config === undefined) {
    return <Loading/>;
  }

  return (
    <FederatedModuleContext.Provider value={config.federatedModules}>
      {children}
    </FederatedModuleContext.Provider>
  );
}
