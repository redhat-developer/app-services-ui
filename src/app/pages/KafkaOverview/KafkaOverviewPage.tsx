import React from 'react';
import { KafkaPage, KafkaPageV2 } from '@rhoas/app-services-ui-components';

export const KafkaOverViewPage: React.FunctionComponent = () => {
  const testRelease = new URLSearchParams((new URL(document.location.toString())).search).get('testRelease')

  return (
    testRelease ? <KafkaPageV2 /> : <KafkaPage />
  );
};

export default KafkaOverViewPage;
