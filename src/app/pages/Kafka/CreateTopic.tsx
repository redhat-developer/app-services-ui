import React from 'react';
import { KafkaFederatedComponent, UnderlyingProps } from "@app/pages/Kafka/KafkaFederatedComponent";

export const CreateTopic: React.FunctionComponent<UnderlyingProps> = (props) => (
  <KafkaFederatedComponent
    module="./CreateTopic"
    {...props}
  />
);
