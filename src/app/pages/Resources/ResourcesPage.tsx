import React, { FunctionComponent } from 'react';
import { FederatedModule, Loading } from '@app/components';
// import useChrome from '@redhat-cloud-services/frontend-components/useChrome/useChrome';

export const ResourcesPage: FunctionComponent = () => {
  // const chrome = useChrome();
  // const { quickStarts } = chrome;
  // console.log(`chrome quickStarts state`);
  // console.log(quickStarts);
  // debugger;

  return <div>Resources</div>;

  return (
    <FederatedModule
      scope="guides"
      module="./QuickStartCatalog"
      fallback={<Loading />}
      render={(QuickStartCatalogFederated) => (
        <QuickStartCatalogFederated />
      )}
    />
  );
};

// export const xResourcesPage: FunctionComponent = () => {
//   const chrome = useChrome();
//   const {
//     quickStarts: { Catalog },
//   } = chrome;
//   return <Catalog />;
// };

export default ResourcesPage;
