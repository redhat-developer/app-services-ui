import { FederatedModule } from '@app/components/FederatedModule/FederatedModule';
import React, { FunctionComponent, useState } from 'react';
import { useConfig } from '@bf2/ui-shared';
import { Loading } from '@app/components/Loading/Loading';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome/useChrome';

export const QuickStartLoaderFederated: FunctionComponent = () => {
  const [quickStartsInitialized, setQuickStartsInitialized] = useState(false);
  const chrome = useChrome();
  const { quickStarts } = chrome;

  const config = useConfig();
  if (config === undefined) {
    return <Loading/>;
  }

  if (window.sessionStorage.getItem('ins_quick-starts_initialized') === 'true') {
    debugger;
    return null;
  }

  try {
    console.group('Experimental API notice');
    console.log('Using experimental chrome API "useChrome"');
    console.log('Api value: ', chrome);
    console.groupEnd();
  } catch (error) {
    /**
     * Do nothing does not break UI
     */
  }
  const onLoad = (qs) => {
    debugger;
    if (quickStarts && !quickStarts.initialized) {
      quickStarts.set(qs);
      console.log(`settings chrome quick starts`);
      console.log(qs);
      setQuickStartsInitialized(true);
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