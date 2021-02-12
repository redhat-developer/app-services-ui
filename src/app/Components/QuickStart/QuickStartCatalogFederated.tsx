import { FederatedModule } from "@app/Components/FederatedModule/FederatedModule";
import React, { FunctionComponent } from 'react';

export const QuickStartCatalogFederated: FunctionComponent = () => (
  <FederatedModule
    scope="guides"
    module="./QuickStartCatalog"
    render={(QuickStartCatalogFederated) => <QuickStartCatalogFederated />}
  />
);
