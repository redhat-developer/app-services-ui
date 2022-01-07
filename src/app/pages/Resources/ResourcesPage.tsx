import React, { VoidFunctionComponent } from 'react';
import { FederatedModule } from '@app/components';
import { AppServicesLoading } from '@rhoas/app-services-ui-components';

export const ResourcesPage: VoidFunctionComponent = () => (
  <FederatedModule
    scope="guides"
    module="./QuickStartCatalog"
    fallback={<AppServicesLoading />}
    render={(QuickStartCatalogFederated) => <QuickStartCatalogFederated />}
  />
);

export default ResourcesPage;
