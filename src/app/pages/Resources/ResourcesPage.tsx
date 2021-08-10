import { FederatedModule } from "@app/components/FederatedModule/FederatedModule";
import React, { FunctionComponent } from 'react';
import { Loading } from '@app/components';

export const ResourcesPage: FunctionComponent = () => (
  <FederatedModule
    scope="guides"
    module="./QuickStartCatalog"
    fallback={<Loading />}
    render={(QuickStartCatalogFederated) => <QuickStartCatalogFederated />}
  />
);

export default ResourcesPage;
