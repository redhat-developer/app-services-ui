import { FederatedModule } from '@app/components/FederatedModule/FederatedModule';
import React, { useState, VoidFunctionComponent } from 'react';
import { useConfig } from '@rhoas/app-services-ui-shared';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome/useChrome';
import { AppServicesLoading } from '@rhoas/app-services-ui-components';

export const appIdentifier = 'applicationServices';

export const QuickStartLoaderFederated: VoidFunctionComponent = () => {
  return (
    <FederatedModule
      scope="guides"
      module="./QuickStartLoader"
      render={(component) => <QuickStartLoaderFederatedConnected Component={component} />}
    />
  );
};

const QuickStartLoaderFederatedConnected: VoidFunctionComponent<{ Component: React.LazyExoticComponent<any> }> = ({
  Component,
}) => {
  const [loaded, setLoaded] = useState(false);
  const chrome = useChrome();
  const { quickStarts } = chrome;

  const config = useConfig();
  if (config === undefined) {
    return <AppServicesLoading />;
  }

  const onLoad = (qs) => {
    if (quickStarts) {
      setLoaded(true); // unload federated module
      quickStarts.set(appIdentifier, qs);
    }
  };
  return !loaded ? <Component showDrafts={config?.guides.showDrafts} onLoad={onLoad} /> : null;
};

export default QuickStartLoaderFederated;
