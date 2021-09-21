import { FederatedModule } from '@app/components/FederatedModule/FederatedModule';
import React, { FunctionComponent, useState } from 'react';
import { AppServicesLoading, useConfig } from '@rhoas/app-services-ui-shared';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome/useChrome';

export const appIdentifier = 'applicationServices';

export const QuickStartLoaderFederated: FunctionComponent = () => {
  const [loaded, setLoaded] = useState(false);
  const chrome = useChrome();
  const { quickStarts } = chrome;

  const config = useConfig();
  if (config === undefined) {
    return <AppServicesLoading/>;
  }

  const onLoad = (qs) => {
    if (quickStarts) {
      setLoaded(true); // unload federated module
      quickStarts.set(appIdentifier, qs);
    }
  };

  return !loaded ? (
    <FederatedModule
      scope="guides"
      module="./QuickStartLoader"
      render={(QuickStartLoaderFederated) => (
        <QuickStartLoaderFederated showDrafts={config?.guides.showDrafts} onLoad={onLoad}/>
      )}
    />
  ) : null;
};

export default QuickStartLoaderFederated;
