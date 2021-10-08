import React from 'react';
import { ProductType, QuotaContext, useConfig } from '@rhoas/app-services-ui-shared';
import { ServiceDownPage } from '@app/pages/ServiceDown/ServiceDownPage';
import { FederatedModule } from '@app/components';
import { useModalControl, useQuota, useMASToken } from '@app/hooks';
import { AppServicesLoading } from '@rhoas/app-services-ui-components';
import { PrincipalsProvider } from '@app/components/PrincipalsProvider/PrincipalsProvider';

export const KasPage: React.FunctionComponent = () => {
  console.log('starting kaspage');
  const config = useConfig();
  const { getQuota } = useQuota(ProductType?.kas);
  const { preCreateInstance, shouldOpenCreateModal } = useModalControl();
  const { getTokenEndPointUrl } = useMASToken();

  let kafkaInstance;

  const getKafkaInstance = (kafka) => {
    kafkaInstance = kafka;
  }

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
            <PrincipalsProvider kafkaInstance={kafkaInstance} shouldIncludeServiceAccount={false}>
              <OpenshiftStreamsFederated
                preCreateInstance={preCreateInstance}
                shouldOpenCreateModal={shouldOpenCreateModal}
                tokenEndPointUrl={getTokenEndPointUrl()}
                getKafkaInstance={getKafkaInstance}
              />
            </PrincipalsProvider>
          </QuotaContext.Provider>
        );
      }}
    />
  );
};

export default KasPage;
