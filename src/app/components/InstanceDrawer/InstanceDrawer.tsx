import React, { FunctionComponent } from 'react';
import { FederatedModule } from '@app/components';
import { KafkaRequest } from '@rhoas/kafka-management-sdk';
import { useConfig } from '@rhoas/app-services-ui-shared';
import { AppServicesLoading } from '@rhoas/app-services-ui-components';
import { useHistory } from 'react-router-dom';

type InstanceDrawerProps = {
  kafkaDetail: KafkaRequest | undefined;
  isExpanded: boolean | undefined;
  activeTab: string;
  onClose: () => void;
};

export const InstanceDrawer: FunctionComponent<InstanceDrawerProps> = ({ children, ...props }) => {
  return (
    <FederatedModule
      scope="kas"
      module="./InstanceDrawer"
      fallback={children}
      render={(component) => (
        <QuickStartLoaderFederatedConnected Component={component} {...props}>
          {children}
        </QuickStartLoaderFederatedConnected>
      )}
    />
  );
};

const QuickStartLoaderFederatedConnected: FunctionComponent<
  { Component: React.LazyExoticComponent<any> } & InstanceDrawerProps
> = ({ Component, isExpanded, onClose, kafkaDetail, activeTab, children }) => {
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
      isExpanded={isExpanded}
      onClose={onClose}
      instanceDetail={kafkaDetail}
      activeTab={activeTab}
      onDeleteInstance={onDeleteInstance}
    >
      {children}
    </Component>
  );
};
