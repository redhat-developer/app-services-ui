import { FederatedModule } from '@app/components/FederatedModule/FederatedModule';
import React, { FunctionComponent } from 'react';
import { useConfig } from '@bf2/ui-shared';
import { Loading } from '@app/components/Loading/Loading';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome/useChrome';

export const appIdentifier = 'applicationServices';

export const QuickStartLoaderFederated: FunctionComponent = () => {
  const chrome = useChrome();
  const { quickStarts } = chrome;

  const config = useConfig();
  if (config === undefined) {
    return <Loading/>;
  }

  if (!quickStarts) {
    return null;
  }

  const onLoad = (qs) => {
    if (quickStarts) {
      if (quickStarts.version >= 1) {
        // update chrome context with quick starts
        quickStarts.set(appIdentifier, qs);
      } else {
        quickStarts.set(qs);
      }
    }
  }

  return (<FederatedModule
      scope="guides"
      module="./QuickStartLoader"
      render={(QuickStartLoaderFederated) => (
        <QuickStartLoaderFederated
          showDrafts={config?.guides.showDrafts}
          onLoad={onLoad}
        />
      )}
    />
  );
};

export default QuickStartLoaderFederated;