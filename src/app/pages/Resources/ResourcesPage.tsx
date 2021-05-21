import { FederatedModule } from "@app/components/FederatedModule/FederatedModule";
import React, { FunctionComponent } from 'react';

export const ResourcesPage: FunctionComponent = () => (
  <FederatedModule
    scope="guides"
    module="./QuickStartCatalog"
    render={(QuickStartCatalogFederated) => <QuickStartCatalogFederated />}
  />
);
