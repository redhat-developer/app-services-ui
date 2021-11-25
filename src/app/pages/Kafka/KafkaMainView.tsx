import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { InstanceDrawer, KasModals } from '@app/components';
import { AccessDeniedPage, Metrics, ServiceDownPage } from '@app/pages';
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
  const { adminServerUrl, kafkaDetail } = useKafkaInstance() || {};

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

  if (kafkaDetail === undefined || kafkaDetail.id === undefined || adminServerUrl === undefined) {
    return <AppServicesLoading />;
  }

  const redirectAfterDeleteInstance = () => {
    history.push('/streams/kafkas');
  };

  const props = {
    kafkaPageLink: history.createHref({
      pathname: '/streams/kafkas',
    }),
    kafkaInstanceLink: history.createHref({
      pathname: `/streams/kafkas/${kafkaDetail.id}/topics`,
    }),
    showMetrics: <Metrics kafkaId={kafkaDetail.id} />,
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
