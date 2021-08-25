import React, { FunctionComponent } from 'react';
import { useConfig } from '@bf2/ui-shared';
import './QuickStartDrawerWrapper.scss';
import { FederatedModule } from "@app/components";

export const QuickStartDrawerWrapper: FunctionComponent = ({ children }) => {
  const config = useConfig();
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
            className="mas-quickstart-drawer"
          >
            {children}
          </QuickStartDrawerFederated>
        )
      }}
    />
  );
};

export default QuickStartDrawerWrapper;
