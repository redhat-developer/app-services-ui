import React from 'react';
import { useConfig } from '@bf2/ui-shared';
import { Loading, FederatedModule } from '@app/components';


type MetricsProps = {
  kafkaId: string;
}

export const Metrics: React.FC<MetricsProps> = ({ kafkaId }) => {
  const config = useConfig();

  if (config === undefined) {
    return <Loading/>;
  }

  return (
    <FederatedModule
      scope="kas"
      module="./Metrics"
      fallback={<Loading />}
      render={(MetricsFederated) => <MetricsFederated kafkaId={kafkaId}/>}
    />
  );
}
