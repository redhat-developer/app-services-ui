import React from 'react';
import { KafkaFederatedComponent, UnderlyingProps } from '@app/pages/Kafka/KafkaFederatedComponent';

export const ConsumerGroups: React.FunctionComponent<UnderlyingProps> = (props) => (
   <KafkaFederatedComponent module="./ConsumerGroups" {...props} />
);
