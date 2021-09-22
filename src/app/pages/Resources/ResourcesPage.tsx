import React, { FunctionComponent } from 'react';
import { FederatedModule } from '@app/components';
import { AppServicesLoading } from "@rhoas/app-services-ui-components";

export const ResourcesPage: FunctionComponent = () => (
  <FederatedModule
    scope="guides"
    module="./QuickStartCatalog"
    fallback={<AppServicesLoading/>}
    render={(QuickStartCatalogFederated) => <QuickStartCatalogFederated/>}
  />
);

export default ResourcesPage;
