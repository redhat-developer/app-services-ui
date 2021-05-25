/* eslint-disable camelcase */
/* eslint-disable no-undef */
import React, { ReactNode, useEffect, useState } from 'react';
import { FederatedModuleConfig, useConfig, AssetsContext } from "@bf2/ui-shared";
import { Loading } from "@app/components/Loading/Loading";

export type FederatedModuleContextProps = {
  [module: string]: FederatedModuleConfig
}

const FederatedModuleContext = React.createContext<FederatedModuleContextProps>({});

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

function loadComponent(scope, module) {
  return async () => {
    // Initializes the share scope. This fills it with known provided modules from this build and all remotes
    await __webpack_init_sharing__('default');
    const container = window[scope]; // or get the container somewhere else
    // Initialize the container, it may provide shared modules
    await container.init(__webpack_share_scopes__.default);
    const factory = await window[scope].get(module);
    const Module = factory();
    console.log(`${Module} loaded ${module} from ${scope}`);
    return Module;
  };
}

const useDynamicScript = ({ url }) => {

  const [ready, setReady] = React.useState(false);
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    if (!url) {
      setFailed(true);
      return;
    }

    const element = document.createElement('script');

    element.src = url;
    element.type = 'text/javascript';
    element.async = true;

    setReady(false);
    setFailed(false);

    element.onload = () => {
      console.log(`Dynamic federated module Loaded: ${url}`);
      setReady(true);
    };

    element.onerror = () => {
      console.error(`Dynamic federated module Error: ${url}`);
      setReady(false);
      setFailed(true);
    };

    document.head.appendChild(element);

    return () => {
      console.log(`Dynamic federated module Removed: ${url}`);
      document.head.removeChild(element);
    };
  }, [url]);

  return {
    ready,
    failed
  };
};

export type FederatedModuleProps = {
  scope: string;
  module: string;
  render: (component: React.LazyExoticComponent<React.ComponentType<any>>) => ReactNode;
  fallback?: any;
}

export const FederatedModule: React.FunctionComponent<FederatedModuleProps> = ({ scope, module, render, fallback }) => {

  const federatedModuleContext = React.useContext(FederatedModuleContext);
  const [moduleInfo, setModuleInfo] = useState<ModuleInfo | undefined>();

  useEffect(() => {
    const fetchModuleInfo = async () => {
      const moduleInfo = await getModuleInfo(federatedModuleContext[scope].basePath, scope, federatedModuleContext[scope].fallbackBasePath);
      setModuleInfo(moduleInfo);
    }
    fetchModuleInfo();
  }, [scope, federatedModuleContext]);

  const { ready, failed } = useDynamicScript({ url: moduleInfo?.entryPoint });

  if (!ready || failed) {
    if (failed && fallback) {
      return fallback;
    }
    return null;
  }

  const Component = React.lazy(
    loadComponent(scope, module)
  );
  const getPath = () => {
    return moduleInfo?.basePath
  }

  return (
    <AssetsContext.Provider value={{ getPath }}>
      <React.Suspense fallback={null}>
          {render(Component)}
      </React.Suspense>
    </AssetsContext.Provider>
  );
}

type ModuleInfo = {
  entryPoint: string
  basePath: string
}

const getModuleInfo = async (baseUrl: string, scope: string, fallbackBasePath?: string): Promise<ModuleInfo | undefined> => {

  const fedModsJsonFileName = "fed-mods.json";

  type FedMods = {
    [key: string]: {
      entry: string[],
      modules: string[]
    };
  };

  const fetchModuleInfo = async (basePath: string) => {
    const url = `${basePath}/${fedModsJsonFileName}`;
    const response = await fetch(url);
    return await response.json()
      .then(json => json as FedMods)
      .then(fedMods => fedMods[scope])
      .then(s => s.entry[0])
      .then(path => {
        if (path.startsWith(basePath)) {
          return {
            entryPoint: path,
            basePath
          };
        }
        return {
          entryPoint: `${basePath}${path}`,
          basePath
        }
      });
  }

  try {
    // First try to fetch the main entry point
    return await fetchModuleInfo(baseUrl);
  } catch (e) {
    if (fallbackBasePath) {
      try {
        // If fetching the main entry point failed, and there is a fallback, try fetching that
        // This allows us to use remote versions locally, transparently
        return await fetchModuleInfo(fallbackBasePath)
      } catch (e1) {
        return undefined;
      }
    }
  }
  return undefined;
}


