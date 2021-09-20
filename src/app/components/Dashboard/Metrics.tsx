import React from 'react';
import { useConfig, useBasename } from '@rhoas/app-services-ui-shared';
import { useHistory } from 'react-router-dom';
import { Loading, FederatedModule } from '@app/components';

type MetricsProps = {
  kafkaId: string;
};

export const Metrics: React.FC<MetricsProps> = ({ kafkaId }) => {
  const history = useHistory();
  const config = useConfig();
  const { getBasename } = useBasename() || {};
  const basename = getBasename && getBasename();

  if (config === undefined) {
    return <Loading />;
  }

  const onCreateTopic = () => {
    history.push(`${basename}/topic/create`);
  };

  return (
    <FederatedModule
      scope="kas"
      module="./Metrics"
      render={(MetricsFederated) => <MetricsFederated kafkaId={kafkaId} onCreateTopic={onCreateTopic} />}
    />
  );
};
