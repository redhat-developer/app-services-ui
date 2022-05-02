import React from 'react';
import { KafkaPage, KafkaPageV2 } from '@rhoas/app-services-ui-components';
import { startOfDay } from 'date-fns';

export const KafkaOverViewPage: React.FunctionComponent = () => {

  const currentDate = startOfDay(new Date())

  const releaseDate = startOfDay(new Date('May 05 2022'))

  if (currentDate >= releaseDate) {
    return <KafkaPageV2 />
  } else {
    return <KafkaPage />
  }


};

export default KafkaOverViewPage;
