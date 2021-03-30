/* eslint-disable camelcase */
/* eslint-disable no-undef */
import React, { ReactNode, useContext, useEffect, useState } from 'react';
import { Loading } from '../Loading/Loading';
import { ConfigContext, FederatedModuleConfig } from "@app/Config/Config";
import { getEntryPoint } from "@app/Components/FederatedModule/utils";

export type FederatedModuleContextProps = {
  [module: string]: FederatedModuleConfig
}

const FederatedModuleContext = React.createContext<FederatedModuleContextProps>({});

export const FederatedModuleProvider: React.FunctionComponent = ({
                                                                   children
                                                                 }) => {

  const config = useContext(ConfigContext);

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
  const [url, setUrl] = useState<string | undefined>();

  useEffect(() => {
    const fetchUrl = async () => {
      const entryPoint = await getEntryPoint(federatedModuleContext[scope].basePath, federatedModuleContext[scope].entryPoint, scope);
      setUrl(entryPoint);
    }
    fetchUrl();
  }, [scope, federatedModuleContext]);

  const { ready, failed } = useDynamicScript({ url });

  if (!ready || failed) {
    if (failed && fallback) {
      return fallback;
    }
    return null;
  }

  const Component = React.lazy(
    loadComponent(scope, module)
  );

  return (
    <React.Suspense fallback={null}>
      {render(Component)}
    </React.Suspense>
  );
}

