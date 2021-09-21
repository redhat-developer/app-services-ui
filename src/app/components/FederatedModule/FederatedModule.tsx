/* eslint-disable camelcase */
/* eslint-disable no-undef */
import React, { ComponentType, ReactNode, useEffect, useRef, useState } from 'react';
import { AppServicesLoading, AssetsContext } from '@rhoas/app-services-ui-shared';
import { getModuleInfo, ModuleInfo } from '@app/components/FederatedModule/moduleInfo';
import { FederatedModuleContext } from '@app/components';

const useIsMounted = () => {
  const isMounted = useRef(false);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  return isMounted;
};

declare function __webpack_init_sharing__(shareScope: string);

declare const __webpack_share_scopes__: {
  default: unknown;
};

type Container = {
  init: (shareScopes: unknown) => Promise<void>;
  get: (module: string) => Promise<{ (): { default: ComponentType<any> } }>;
};

function loadComponent(scope, module) {
  return async () => {
    // Initializes the share scope. This fills it with known provided modules from this build and all remotes
    await __webpack_init_sharing__('default');
    const container = window[scope] as unknown as Container; // or get the container somewhere else
    // Initialize the container, it may provide shared modules
    await container.init(__webpack_share_scopes__.default);
    const factory = await container.get(module);
    const Module = factory();
    console.debug(`loaded ${module} from ${scope}`);
    return Module;
  };
}

const useDynamicScript = (url: string) => {
  const isMounted = useIsMounted();
  const [ready, setReady] = React.useState(false);
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    let element;
    if (isMounted.current) {
      if (!url) {
        setFailed(true);
        return;
      }

      element = document.createElement('script');

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
    }

    return () => {
      if (element) {
        console.log(`Dynamic federated module Removed: ${url}`);
        document.head.removeChild(element);
      }
    };
  }, [url]);

  return {
    ready,
    failed,
  };
};

export type FederatedModuleProps = {
  scope: string;
  module: string;
  render: (component: React.LazyExoticComponent<React.ComponentType<any>>) => ReactNode;
  fallback?: React.ReactNode;
};

export const FederatedModule: React.FunctionComponent<FederatedModuleProps> = ({ scope, module, render, fallback }) => {
  const isMounted = useIsMounted();

  const federatedModuleContext = React.useContext(FederatedModuleContext);
  const [moduleInfo, setModuleInfo] = useState<ModuleInfo | undefined>();

  useEffect(() => {
    const fetchModuleInfo = async () => {
      const moduleInfo = await getModuleInfo(
        federatedModuleContext[scope].basePath,
        scope,
        federatedModuleContext[scope].fallbackBasePath
      );
      if (isMounted.current) {
        setModuleInfo(moduleInfo);
      }
    };
    fetchModuleInfo();
  }, [scope, federatedModuleContext]);

  if (moduleInfo !== undefined) {
    return <DynamicFederatedModule scope={scope} module={module} render={render} moduleInfo={moduleInfo} />;
  }
  if (fallback !== undefined) {
    return <>{fallback}</>;
  }
  return null;
};

type DynamicFederatedModuleProps = FederatedModuleProps & {
  moduleInfo: ModuleInfo;
};

const DynamicFederatedModule: React.FunctionComponent<DynamicFederatedModuleProps> = ({
  moduleInfo,
  fallback,
  scope,
  render,
  module,
}) => {
  const { ready, failed } = useDynamicScript(moduleInfo.entryPoint);

  if (ready && !failed) {
    const Component = React.lazy(loadComponent(scope, module));

    const getPath = () => {
      return moduleInfo.basePath;
    };

    return (
      <AssetsContext.Provider value={{ getPath }}>
        <React.Suspense fallback={<AppServicesLoading />}>{render(Component)}</React.Suspense>
      </AssetsContext.Provider>
    );
  }

  if (fallback) {
    return <>{fallback}</>;
  }
  return null;
};
