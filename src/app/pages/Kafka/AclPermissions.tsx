import React from 'react';
import { KafkaFederatedComponent, UnderlyingProps } from '@app/pages/Kafka/KafkaFederatedComponent';

export const AclPermissions: React.FunctionComponent<UnderlyingProps> = (props) => (
     <KafkaFederatedComponent module="./AclPermissions" {...props} />
);
