import React from 'react';
import { useConfig, ProductType, QuotaContext } from '@bf2/ui-shared';
import { ServiceDownPage } from '@app/pages/ServiceDown/ServiceDownPage';
import { FederatedModule, Loading } from '@app/components';
import { useQuota, useModalControl } from '@app/hooks';

export const KasPage: React.FunctionComponent = () => {
  const config = useConfig();
  const { getQuota } = useQuota(ProductType?.kas);

  const { preCreateInstance, shouldOpenCreateModal } = useModalControl();

  const getTokenEndPointUrl = () => {
    if (config) {
      return `${config.masSso.authServerUrl}/realms/${config.masSso.realm}/protocol/openid-connect/token`;
    }
    return undefined;
  };

  return (
    <FederatedModule
      scope="kas"
      module="./OpenshiftStreams"
      fallback={<Loading />}
      render={(OpenshiftStreamsFederated) => {
        if (config?.serviceDown) {
          return <ServiceDownPage />;
        }

        return (
          <QuotaContext.Provider value={{ getQuota }}>
            <OpenshiftStreamsFederated
              preCreateInstance={preCreateInstance}
              shouldOpenCreateModal={shouldOpenCreateModal}
              tokenEndPointUrl={getTokenEndPointUrl()}
            />
          </QuotaContext.Provider>
        );
      }}
    />
  );
};

export default KasPage;
