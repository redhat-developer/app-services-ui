import React from 'react';
import { KafkaFederatedComponent, UnderlyingProps } from "@app/pages/Kafka/KafkaFederatedComponent";

export const UpdateTopic: React.FunctionComponent<UnderlyingProps> = (props) => (
  <KafkaFederatedComponent
    module="./UpdateTopic"
    {...props}
  />
);
