import React, { useState, useMemo } from 'react';
import { ProductType, QuotaContext, useConfig } from '@rhoas/app-services-ui-shared';
import { ServiceDownPage } from '@app/pages/ServiceDown/ServiceDownPage';
import { FederatedModule } from '@app/components';
import { useModalControl, useQuota, useMASToken } from '@app/hooks';
import { AppServicesLoading } from '@rhoas/app-services-ui-components';
import { PrincipalsProvider } from '@app/components/PrincipalsProvider/PrincipalsProvider';
import { KafkaRequest } from '@rhoas/kafka-management-sdk';

type KasPageConnectedProps = {
  getKafkaInstance: (kafka: KafkaRequest) => void;
};

const KasPageConnected: React.FC<KasPageConnectedProps> = React.memo(({ getKafkaInstance }) => {
  const config = useConfig();
  const { getQuota } = useQuota(ProductType?.kas);
  const { preCreateInstance, shouldOpenCreateModal } = useModalControl();
  const { getTokenEndPointUrl } = useMASToken();

  if (config?.serviceDown) {
    return <ServiceDownPage />;
  }

  return (
    <FederatedModule
      scope="kas"
      module="./OpenshiftStreams"
      fallback={<AppServicesLoading />}
      render={(OpenshiftStreamsFederated) => {
        return (
          <QuotaContext.Provider value={{ getQuota }}>
            <OpenshiftStreamsFederated
              preCreateInstance={preCreateInstance}
              shouldOpenCreateModal={shouldOpenCreateModal}
              tokenEndPointUrl={getTokenEndPointUrl()}
              getKafkaInstance={getKafkaInstance}
            />
          </QuotaContext.Provider>
        );
      }}
    />
  );
});

const KasPage = () => {
  const [kafkaInstance, setKafkaInstance] = useState<KafkaRequest>();

  const getKafkaInstance = (kafka: KafkaRequest) => {
    setKafkaInstance(kafka);
  };

  const getKafkaInstanceMemoized = useMemo(() => getKafkaInstance, []);

  return (
    <PrincipalsProvider kafkaInstance={kafkaInstance}>
      <KasPageConnected getKafkaInstance={getKafkaInstanceMemoized} />
    </PrincipalsProvider>
  );
};

export default KasPage;
