import React from 'react';
import { KafkaFederatedComponent, UnderlyingProps } from '@app/pages/Kafka/KafkaFederatedComponent';
import { KasModalLoader } from '@app/components';

export const ConsumerGroups: React.FunctionComponent<UnderlyingProps> = (props) => (
  <KasModalLoader>
    <KafkaFederatedComponent module="./ConsumerGroups" {...props} />
  </KasModalLoader>
);
