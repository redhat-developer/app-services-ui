import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
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
  const kafka = useKafkaInstance();

  const [error, setError] = useState<undefined | number>();
  const [isInstanceDrawerOpen, setIsInstanceDrawerOpen] = useState<boolean | undefined>();
  const [activeDrawerTab, setActiveDrawerTab] = useState<string>('');

  const handleInstanceDrawer = (isOpen: boolean, activeTab?: string) => {
    activeTab && setActiveDrawerTab(activeTab);
    setIsInstanceDrawerOpen(isOpen);
  };

  const onCloseInstanceDrawer = () => {
    setIsInstanceDrawerOpen(false);
  };

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
    kafkaPageLink: history.createHref({
      pathname: '/streams/kafkas',
    }),
    kafkaInstanceLink: history.createHref({
      pathname: `/streams/kafkas/${kafkaDetail.id}/topics`,
    }),
    showMetrics: <ConnectedMetrics kafkaId={kafkaDetail.id} kafkaAdminUrl={adminServerUrl} />,
    onError: (code: number) => {
      setError(code);
    },
    kafkaName: kafkaDetail.name,
    apiBasePath: adminServerUrl,
    getToken: auth?.kafka.getToken,
    handleInstanceDrawer,
    showSchemas: <ServiceRegistrySchemaMapping />,
    kafka: kafkaDetail,
    redirectAfterDeleteInstance,
  } as UnderlyingProps;

  if (error === 401) {
    return <AccessDeniedPage />;
  }

  return (
    <div className="app-services-ui--u-display-contents" data-ouia-app-id="dataPlane-streams">
      <PrincipalsProvider kafkaInstance={kafkaDetail}>
        <InstanceDrawer
          isExpanded={isInstanceDrawerOpen}
          onClose={onCloseInstanceDrawer}
          kafkaDetail={kafkaDetail}
          activeTab={activeDrawerTab}
        >
          <KafkaRoutes {...props} />
        </InstanceDrawer>
      </PrincipalsProvider>
    </div>
  );
};
