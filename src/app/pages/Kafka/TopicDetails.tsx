import React from 'react';
import { KafkaFederatedComponent, UnderlyingProps } from "@app/pages/Kafka/KafkaFederatedComponent";

export const TopicDetails: React.FunctionComponent<UnderlyingProps> = (props) => (
  <KafkaFederatedComponent
    module="./TopicDetails"
    {...props}
  />
);
