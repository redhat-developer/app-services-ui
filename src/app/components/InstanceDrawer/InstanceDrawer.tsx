import React, { ReactElement, VoidFunctionComponent } from 'react';
import { FederatedModule } from '@app/components';
import { useConfig } from '@rhoas/app-services-ui-shared';
import { AppServicesLoading } from '@rhoas/app-services-ui-components';
import { useHistory } from 'react-router-dom';
import { KafkaRequest } from '@rhoas/kafka-management-sdk';

type InstanceDrawerProps = {
  kafkaInstance: KafkaRequest;
  Component: React.LazyExoticComponent<any>;
  renderContent: (props: {
    handleInstanceDrawer: (isOpen: boolean, activeTab?: string) => void;
    setInstance: (instance: KafkaRequest) => void;
  }) => ReactElement;
};

export const InstanceDrawer: VoidFunctionComponent<Omit<InstanceDrawerProps, 'Component'>> = (props) => {
  return (
    <FederatedModule
      scope="kas"
      module="./InstanceDrawer"
      fallback={null}
      render={(component) => <InstanceDrawerConnected Component={component} {...props} />}
    />
  );
};

const InstanceDrawerConnected: VoidFunctionComponent<InstanceDrawerProps> = ({
  Component,
  renderContent,
  kafkaInstance,
  ...props
}) => {
  const config = useConfig();
  const history = useHistory();
  if (config === undefined) {
    return <AppServicesLoading />;
  }

  const { authServerUrl, realm } = config?.masSso || {};
  const tokenEndPointUrl = `${authServerUrl}/realms/${realm}/protocol/openid-connect/token`;

  const onDeleteInstance = () => {
    history.push('/streams/kafkas');
  };

  return (
    <Component
      tokenEndPointUrl={tokenEndPointUrl}
      onDeleteInstance={onDeleteInstance}
      renderContent={({ closeDrawer, openDrawer, setInstance }) => {
        const handleInstanceDrawer = (isOpen: boolean, activeTab?: string) => {
          isOpen ? openDrawer() : closeDrawer();
        };
        return renderContent({ handleInstanceDrawer, setInstance });
      }}
      initialInstance={kafkaInstance}
      {...props}
    />
  );
};
