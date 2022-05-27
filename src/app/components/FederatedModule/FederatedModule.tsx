import {
  ComponentType,
  FunctionComponent,
  lazy,
  LazyExoticComponent,
  ReactNode,
  useEffect,
  useRef,
  useState,
  VoidFunctionComponent,
  Suspense,
} from "react";
import { AssetsContext } from "@rhoas/app-services-ui-shared";
import { ModuleInfo } from "@app/components/FederatedModule/moduleInfo";
import { useFederatedModule } from "@app/components";
import { AppServicesLoading } from "@rhoas/app-services-ui-components";

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

type Container = {
  init: (shareScopes: unknown) => Promise<void>;
  get: (module: string) => Promise<{ (): { default: ComponentType<unknown> } }>;
};

function loadComponent(scope: string, module: string) {
  return async () => {
    // Initializes the share scope. This fills it with known provided modules from this build and all remotes
    await __webpack_init_sharing__("default");
    const container = (window as any)[scope] as unknown as Container; // or get the container somewhere else
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
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let element: HTMLScriptElement;
    if (isMounted.current) {
      if (!url) {
        setFailed(true);
        return;
      }

      element = document.createElement("script");

      element.src = url;
      element.type = "text/javascript";
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
  }, [isMounted, url]);

  return {
    ready,
    failed,
  };
};

export type FederatedModuleProps = {
  scope: string;
  module: string;
  render: (component: LazyExoticComponent<ComponentType<any>>) => ReactNode;
  fallback?: ReactNode;
};

export const FederatedModule: VoidFunctionComponent<FederatedModuleProps> = ({
  scope,
  module,
  render,
  fallback,
}) => {
  console.log("Dynamic federated module", scope, module);
  const isMounted = useIsMounted();

  const { getModuleInfo, modules } = useFederatedModule();
  const [moduleInfo, setModuleInfo] = useState<ModuleInfo | undefined>();

  useEffect(() => {
    const fetchModuleInfo = async () => {
      const moduleInfo = await getModuleInfo(
        modules[scope].basePath,
        scope,
        modules[scope].fallbackBasePath
      );
      if (isMounted.current) {
        setModuleInfo(moduleInfo);
      }
    };
    fetchModuleInfo();
  }, [scope, modules, getModuleInfo, isMounted]);

  if (moduleInfo !== undefined) {
    return (
      <DynamicFederatedModule
        scope={scope}
        module={module}
        render={render}
        moduleInfo={moduleInfo}
      />
    );
  }
  if (fallback !== undefined) {
    return <>{fallback}</>;
  }
  return null;
};

type DynamicFederatedModuleProps = FederatedModuleProps & {
  moduleInfo: ModuleInfo;
};

const DynamicFederatedModule: FunctionComponent<
  DynamicFederatedModuleProps
> = ({ moduleInfo, fallback, scope, render, module }) => {
  const { ready, failed } = useDynamicScript(moduleInfo.entryPoint);

  if (ready && !failed) {
    const Component = lazy(loadComponent(scope, module));

    const getPath = () => {
      return moduleInfo.basePath;
    };

    return (
      <AssetsContext.Provider value={{ getPath }}>
        <Suspense fallback={<AppServicesLoading />}>
          {render(Component)}
        </Suspense>
      </AssetsContext.Provider>
    );
  }

  if (fallback) {
    return <>{fallback}</>;
  }
  return null;
};
