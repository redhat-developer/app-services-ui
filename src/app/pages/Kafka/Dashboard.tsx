import React from 'react';
import { KafkaFederatedComponent, UnderlyingProps } from '@app/pages/Kafka/KafkaFederatedComponent';

export const Dashboard: React.FunctionComponent<UnderlyingProps> = (props) => ( 
    <KafkaFederatedComponent module="./Dashboard" {...props} />
);
