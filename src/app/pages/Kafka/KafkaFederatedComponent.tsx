import React from 'react';
import { FederatedModule } from '@app/components';
import { KafkaRequestWithTopicConfig } from '@app/pages/Kafka/kafka-instance';

export type KafkaFederatedComponentProps = UnderlyingProps & {
  module: string;
};

export type UnderlyingProps = {
  activeTab?: number;
  getToken?: () => Promise<string>;
  apiBasePath: string;
  kafkaName?: string;
  kafkaPageLink?: string;
  kafkaInstanceLink?: string;
  onError?: (errorCode: number, message?: string) => void;
  handleInstanceDrawer?: (isOpen: boolean, activeTab?: string) => void;
  showMetrics?: JSX.Element;
  showSchemas?: JSX.Element;
  kafka?: KafkaRequestWithTopicConfig;
  redirectAfterDeleteInstance?: () => void;
};

// Provides properties for component path and it's underlying properties
export const KafkaFederatedComponent: React.FunctionComponent<KafkaFederatedComponentProps> = ({ module, ...rest }) => {
  return (
    <FederatedModule
      data-ouia-app-id="dataPlane-streams"
      scope="kafka"
      module={module}
      render={(FederatedKafka) => <FederatedKafka {...rest} />}
    />
  );
};
