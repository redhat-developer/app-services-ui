import React from 'react';
import { useHistory } from 'react-router-dom';
import { useBasename, useConfig } from '@rhoas/app-services-ui-shared';
import { FederatedModule } from '@app/components';
import { AppServicesLoading } from "@rhoas/app-services-ui-components";

type MetricsProps = {
  kafkaId: string;
};

export const Metrics: React.FC<MetricsProps> = ({ kafkaId }) => {
  const history = useHistory();
  const config = useConfig();
  const { getBasename } = useBasename() || {};
  const basename = getBasename && getBasename();

  if (config === undefined) {
    return <AppServicesLoading/>;
  }

  const onCreateTopic = () => {
    history.push(`${basename}/topic/create`);
  };

  return (
    <FederatedModule
      scope="kas"
      module="./Metrics"
      render={(MetricsFederated) => <MetricsFederated kafkaId={kafkaId} onCreateTopic={onCreateTopic}/>}
    />
  );
};
