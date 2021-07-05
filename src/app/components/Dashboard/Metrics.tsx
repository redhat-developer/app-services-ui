import React from 'react';
import { useConfig } from '@bf2/ui-shared';
import { Loading, FederatedModule } from '@app/components';

interface MetricsProps {
  kafkaId: string;
}

export const Metrics: React.FC<MetricsProps> = ({ kafkaId, children }) => {
  const config = useConfig();

  if (config === undefined) {
    return <Loading />;
  }

  return (
    <FederatedModule
      scope="kas"
      module="./Metrics"
      render={(MetricsFederated) => {
        return <MetricsFederated kafkaId={kafkaId}>{children}</MetricsFederated>;
      }}
    />
  );
};
