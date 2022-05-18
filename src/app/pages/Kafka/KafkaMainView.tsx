import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { InstanceDrawer } from '@app/components';
import { AccessDeniedPage, ConnectedMetrics, ServiceDownPage } from '@app/pages';
import { useKafkaInstance } from '@app/pages/Kafka/kafka-instance';
import { UnderlyingProps } from '@app/pages/Kafka/KafkaFederatedComponent';
import { PrincipalsProvider } from '@app/components/PrincipalsProvider/PrincipalsProvider';
import { useAuth, useConfig } from '@rhoas/app-services-ui-shared';
import { AppServicesLoading } from '@rhoas/app-services-ui-components';
import { ServiceRegistrySchemaMapping } from '@app/pages/ServiceRegistry';
import { KafkaRoutes } from './KafkaRoutes';

export const KafkaMainView = (): React.ReactElement => {
  const auth = useAuth();
  const history = useHistory();
  const config = useConfig();
  const { id } = useParams<{ id: string }>();
  const kafka = useKafkaInstance(id);

  const [error, setError] = useState<undefined | number>();

  if (config?.serviceDown) {
    return <ServiceDownPage />;
  }

  if (kafka === undefined) {
    return <AppServicesLoading />;
  }

  if (kafka === false) {
    throw new Error('404');
  }

  const redirectAfterDeleteInstance = () => {
    history.push('/streams/kafkas');
  };

  const { kafkaDetail, adminServerUrl } = kafka;

  const props = {
    kafkaPageLink: '/streams/kafkas',
    kafkaInstanceLink: `/streams/kafkas/${kafkaDetail.id}/topics`,
    showMetrics: <ConnectedMetrics kafkaId={kafkaDetail.id} kafkaAdminUrl={adminServerUrl} instanceType={kafkaDetail.instance_type === "standard" ? "standard" : "trial"} />,
    onError: (code: number) => {
      setError(code);
    },
    kafkaName: kafkaDetail.name,
    apiBasePath: adminServerUrl,
    getToken: auth?.kafka.getToken,
    showSchemas: <ServiceRegistrySchemaMapping />,
    kafka: kafkaDetail,
    redirectAfterDeleteInstance,
  } as UnderlyingProps;

  if (error === 401) {
    return <AccessDeniedPage />;
  }

  return (
    <PrincipalsProvider kafkaInstance={kafkaDetail}>
      <InstanceDrawer
        data-ouia-app-id="dataPlane-streams"
        kafkaInstance={kafkaDetail}
        renderContent={({ handleInstanceDrawer, setInstance }) => (
          <KafkaRoutes
            handleInstanceDrawer={(isOpen) => {
              setInstance(kafkaDetail);
              handleInstanceDrawer(isOpen);
            }}
            {...props}
          />
        )}
      />
    </PrincipalsProvider>
  );
};
