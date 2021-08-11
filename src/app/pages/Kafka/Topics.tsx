import React from 'react';
import { useParams } from 'react-router-dom';
import { KafkaFederated } from './KafkaFederated';
import { Metrics } from '@app/components';

const Topics: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const showMetrics = () => {
    return <Metrics kafkaId={id} />;
  };

  return <KafkaFederated module="./KafkaMainView" showMetrics={showMetrics()} />;
};

export default Topics;
