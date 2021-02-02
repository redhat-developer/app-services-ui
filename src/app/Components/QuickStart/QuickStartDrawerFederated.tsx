import { FederatedModule } from '@app/Components/FederatedModule';
import React, { FunctionComponent } from 'react';

export const QuickStartDrawerFederated: FunctionComponent = ({ children }) => (
  <FederatedModule
    scope="guides"
    module="./QuickStartDrawer"
    fallback={children}
    render={(QuickStartDrawerFederated) => <QuickStartDrawerFederated>{children}</QuickStartDrawerFederated>}
  />
);
