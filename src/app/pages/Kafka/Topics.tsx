import React from 'react';
import { KafkaFederated } from './KafkaFederated';

const Topics: React.FC = () => {
  return <KafkaFederated module="./KafkaMainView" />;
};

export default Topics;
