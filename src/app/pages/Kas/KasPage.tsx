import React from 'react';
import { ProductType, QuotaContext, useConfig } from '@rhoas/app-services-ui-shared';
import { ServiceDownPage } from '@app/pages/ServiceDown/ServiceDownPage';
import { FederatedModule, usePrincipal } from '@app/components';
import { useModalControl, useQuota, useMASToken } from '@app/hooks';
import { AppServicesLoading } from '@rhoas/app-services-ui-components';
import termsConfig from '../../../../static/configs/terms-conditions-spec.json';

const KasPage: React.FC = () => {
  const config = useConfig();
  const { getQuota } = useQuota(ProductType?.kas);
  const { preCreateInstance, shouldOpenCreateModal } = useModalControl(termsConfig.kafka.EventCode);
  const { getTokenEndPointUrl } = useMASToken();
  const { getAllUserAccounts } = usePrincipal();

  return (
    <FederatedModule
      scope="kas"
      module="./OpenshiftStreams"
      fallback={<AppServicesLoading />}
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
              getAllUserAccounts={getAllUserAccounts}
            />
          </QuotaContext.Provider>
        );
      }}
    />
  );
};

export default KasPage;
