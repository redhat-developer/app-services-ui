import React, { useState, useMemo } from 'react';
import { ProductType, QuotaContext, useConfig } from '@rhoas/app-services-ui-shared';
import { ServiceDownPage } from '@app/pages/ServiceDown/ServiceDownPage';
import { FederatedModule } from '@app/components';
import { useModalControl, useQuota, useMASToken } from '@app/hooks';
import { AppServicesLoading } from '@rhoas/app-services-ui-components';
import { PrincipalsProvider } from '@app/components/PrincipalsProvider/PrincipalsProvider';
import { KafkaRequest } from '@rhoas/kafka-management-sdk';

type KasPageConnectedProps = {
  setKafkaInstance: (kafka: KafkaRequest) => void;
};

const KasPageConnected: React.FC<KasPageConnectedProps> = ({ setKafkaInstance }) => {
  const config = useConfig();
  const { getQuota } = useQuota(ProductType?.kas);
  const { preCreateInstance, shouldOpenCreateModal } = useModalControl();
  const { getTokenEndPointUrl } = useMASToken();

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
              setKafkaInstance={setKafkaInstance}
            />
          </QuotaContext.Provider>
        );
      }}
    />
  );
};

const KasPageConnectedMemoized = React.memo(KasPageConnected);

const KasPage = () => {
  const [kafka, setKafka] = useState<KafkaRequest>();

  const setKafkaInstance = (kafka: KafkaRequest) => {
    setKafka(kafka);
  };

  const setKafkaInstanceMemoized = useMemo(() => setKafkaInstance, []);

  return (
    <PrincipalsProvider kafkaInstance={kafka}>
      <KasPageConnectedMemoized setKafkaInstance={setKafkaInstanceMemoized} />
    </PrincipalsProvider>
  );
};

export default KasPage;
