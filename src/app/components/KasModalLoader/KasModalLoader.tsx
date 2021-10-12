import React from 'react';
import { FederatedModule } from '@app/components';

export const KasModalLoader: React.FC = ({ children }) => {
  return (
    <FederatedModule
      scope="kas"
      module="./KasModalLoader"
      fallback={null}
      render={(KasModalLoaderFederated) => {
        return <KasModalLoaderFederated>{children}</KasModalLoaderFederated>;
      }}
    />
  );
};
