import React, { useRef } from "react";
import { FederatedModuleConfig, useConfig } from "@rhoas/app-services-ui-shared";
import { AppServicesLoading } from "@rhoas/app-services-ui-components";
import { fetchModuleInfo, FetchModuleInfoFunction, ModuleInfo } from "@app/components/FederatedModule/moduleInfo";

export type FederatedModuleContextProps = {
  modules: {
    [module: string]: FederatedModuleConfig
  };
  getModuleInfo: FetchModuleInfoFunction;
}

export const FederatedModuleContext = React.createContext<FederatedModuleContextProps | undefined>(undefined);

export const FederatedModuleProvider: React.FunctionComponent = ({ children }) => {

  type ModuleInfoCache = {
    [key:string]: ModuleInfo
  }

  const moduleInfoCache = useRef<ModuleInfoCache>({} as ModuleInfoCache );
  const config = useConfig();

  if (config === undefined) {
    return <AppServicesLoading/>;
  }

  const getModuleInfo: FetchModuleInfoFunction = async ( baseUrl,scope, fallbackBasePath) => {
    if (moduleInfoCache.current[scope] !== undefined) {
      return moduleInfoCache.current[scope];
    }
    const answer = await fetchModuleInfo(baseUrl, scope, fallbackBasePath);
    if (answer !== undefined) {
      moduleInfoCache.current[scope] = answer;
    }
    return answer;
  }

  return (
    <FederatedModuleContext.Provider value={{
      modules: config.federatedModules,
      getModuleInfo
    }}>
      {children}
    </FederatedModuleContext.Provider>
  );
}

export const useFederatedModule = (): FederatedModuleContextProps => {
  const answer = React.useContext(FederatedModuleContext);
  if (answer === undefined) {
    throw new Error('must be used inside FederatedModuleContext provider');
  }
  return answer;
}
