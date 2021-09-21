import React from 'react';
import { ProductType, QuotaContext, useConfig } from '@rhoas/app-services-ui-shared';
import { ServiceDownPage } from '@app/pages/ServiceDown/ServiceDownPage';
import { FederatedModule } from '@app/components';
import { useModalControl, useQuota } from '@app/hooks';
import { AppServicesLoading } from "@rhoas/app-services-ui-components";

export const KasPage: React.FunctionComponent = () => {
  console.log('starting kaspage');
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
      fallback={<AppServicesLoading/>}
      render={(OpenshiftStreamsFederated) => {
        if (config?.serviceDown) {
          return <ServiceDownPage/>;
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
