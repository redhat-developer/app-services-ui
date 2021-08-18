import { FederatedModule } from "@app/components/FederatedModule/FederatedModule";
import React, { FunctionComponent } from 'react';
import { Loading } from '@app/components';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome/useChrome';

export const xResourcesPage: FunctionComponent = () => (
  <FederatedModule
    scope="guides"
    module="./QuickStartCatalog"
    fallback={<Loading />}
    render={(QuickStartCatalogFederated) => <QuickStartCatalogFederated />}
  />
);

export const ResourcesPage: FunctionComponent = () => {
  const chrome = useChrome();
  const { quickStarts: { Catalog } } = chrome;
  return <Catalog />;
};

export default ResourcesPage;
