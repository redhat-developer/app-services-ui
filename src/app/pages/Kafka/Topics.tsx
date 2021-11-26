import React from 'react';
import { KafkaFederatedComponent, UnderlyingProps } from '@app/pages/Kafka/KafkaFederatedComponent';

export const Topics: React.FunctionComponent<UnderlyingProps> = (props) => (
    <KafkaFederatedComponent module="./Topics" {...props} />
);
