/* eslint-disable camelcase */
/* eslint-disable no-undef */
import React from 'react';
import PropTypes from 'prop-types';
import { Loading } from './Loading/Loading';

const FederatedModuleContext = React.createContext({});

export function FederatedModuleProvider({ configUrl, children }) {
    const [config, setConfig] = React.useState({});
    React.useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        (async () => {
            console.log('Loading federated modules config');
            const response = await fetch(configUrl, { signal });
            const newConfig = await response.json();
            setConfig(newConfig);
            console.log('Done loading federated modules config', newConfig);
        })();

        return () => controller.abort();
    }, [configUrl]);

    return (
        <FederatedModuleContext.Provider value={config}>
            {children}
        </FederatedModuleContext.Provider>
    );
}

FederatedModuleProvider.propTypes = {
    configUrl: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};

function useFederatedModule(module) {
    const context = React.useContext(FederatedModuleContext);
    return context[module];
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

export function FederatedModule({ scope, module, render }) {
    const url = useFederatedModule(scope);
    const { ready, failed } = useDynamicScript({ url });

    if (!ready || failed) {
        return null;
    }

    const Component = React.lazy(
        loadComponent(scope, module)
    );

    return (
        <React.Suspense fallback={<Loading/>}>
            {render(Component)}
        </React.Suspense>
    );
}

