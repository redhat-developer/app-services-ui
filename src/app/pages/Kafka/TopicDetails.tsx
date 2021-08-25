import React from 'react';
import { KafkaFederated } from './KafkaFederated';

const TopicDetails: React.FC = () => {
  return <KafkaFederated module="./TopicDetails" />;
};

export default TopicDetails;
