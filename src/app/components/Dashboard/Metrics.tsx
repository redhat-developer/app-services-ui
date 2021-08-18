import React from 'react';
import { useConfig } from '@bf2/ui-shared';
import { Loading, FederatedModule } from '@app/components';

type MetricsProps = {
  kafkaId: string;
  onCreateTopic: () => void;
};

export const Metrics: React.FC<MetricsProps> = ({ kafkaId, onCreateTopic }) => {
  const config = useConfig();

  if (config === undefined) {
    return <Loading />;
  }

  return (
    <FederatedModule
      scope="kas"
      module="./Metrics"
      render={(MetricsFederated) => <MetricsFederated kafkaId={kafkaId} onCreateTopic={onCreateTopic} />}
    />
  );
};
