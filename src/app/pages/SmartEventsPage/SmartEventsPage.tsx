import React from 'react';
import { FederatedModule } from '@app/components';
import { AppServicesLoading } from '@rhoas/app-services-ui-components';

const SmartEventsPage: React.FC = () => {
  return (
    <>
      <FederatedModule
        scope="smart_events"
        fallback={<AppServicesLoading />}
        module="./SmartEventsApp"
        render={(SmartEventsApp) => <SmartEventsApp />}
      />
    </>
  );
};

export default SmartEventsPage;
