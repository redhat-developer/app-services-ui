import React, { FunctionComponent } from 'react';
import { useConfig } from '@bf2/ui-shared';
import { FederatedModule } from "@app/components";
import useChrome from '@redhat-cloud-services/frontend-components/useChrome/useChrome';

export const QuickStartDrawerWrapper: FunctionComponent = ({ children }) => {
  const config = useConfig();
  const chrome = useChrome();
  const { quickStarts } = chrome;

  if (quickStarts) {
    // If we have the useChrome quick starts functionality,
    // do not use this federated drawer
    return <>{children}</>;
  }
  
  return (<FederatedModule
      scope="guides"
      module="./QuickStartDrawer"
      fallback={children}
      render={(QuickStartDrawerFederated) => {
        return (
          <QuickStartDrawerFederated
            showDrafts={config?.guides.showDrafts}
            appendTo={() => document.querySelector("#qs-include")}
            root={() => document.querySelector('#qs-root')}
            style={{ height: 'calc(100vh - 76px)' }}
          >
            {children}
          </QuickStartDrawerFederated>
        )
      }}
    />
  );
};

export default QuickStartDrawerWrapper;
