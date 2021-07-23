import { FederatedModule } from '@app/components/FederatedModule/FederatedModule';
import React, { FunctionComponent } from 'react';
import { useConfig } from '@bf2/ui-shared';
import { Loading } from '@app/components/Loading/Loading';
import './QuickStartDrawerFederated.scss';

export const QuickStartDrawerFederated: FunctionComponent = ({ children }) => {
  const config = useConfig();

  if (config === undefined) {
    return <Loading/>;
  }

  return (<FederatedModule
      scope="guides"
      module="./QuickStartDrawer"
      fallback={children}
      render={(QuickStartDrawerFederated) => (
        <QuickStartDrawerFederated
          showDrafts={config?.guides.showDrafts}
          appendTo={() => document.querySelector("#qs-include")}
          root={() => document.querySelector('#qs-root')}
          className="mas-quickstart-drawer"
        >
          {children}
        </QuickStartDrawerFederated>
      )}
    />
  );
};

export default QuickStartDrawerFederated;
