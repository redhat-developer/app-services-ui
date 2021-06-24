import React from 'react';
import { KafkaFederated } from './KafkaFederated';

export const Topics: React.FC = () => {
  return <KafkaFederated module="./KafkaMainView" />;
};
