import React, { useContext } from 'react';
import { ProductType, QuotaContext, useConfig } from '@rhoas/app-services-ui-shared';
import { ServiceDownPage } from '@app/pages/ServiceDown/ServiceDownPage';
import { FederatedModule, usePrincipal } from '@app/components';
import { useModalControl, useQuota, useMASToken } from '@app/hooks';
import { AppServicesLoading } from '@rhoas/app-services-ui-components';
import { ITermsConfig } from '@app/services';
import { ConstantContext } from '@app/providers/config/ServiceConstantsContextProvider';
import { ServiceConstants } from '@app/providers/config/ServiceConstants';


const KasPage: React.FC = () => {
  const config = useConfig();
  const constants =  useContext(ConstantContext) as ServiceConstants ;
  const { getQuota } = useQuota(ProductType?.kas);
  const { preCreateInstance, shouldOpenCreateModal } = useModalControl({
    eventCode: constants.kafka.ams.termsAndConditionsEventCode,
    siteCode: constants.kafka.ams.termsAndConditionsSiteCode,
  } as ITermsConfig);
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
