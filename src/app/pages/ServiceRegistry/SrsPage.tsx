import React from 'react';
import { useConfig } from '@bf2/ui-shared';
import { ServiceDownPage } from '@app/pages';
import { DevelopmentPreview, FederatedModule, Loading } from '@app/components';

export const SrsPage: React.FC = () => {
  const config = useConfig();

  if (config?.serviceDown) {
    return <ServiceDownPage />;
  }

  return <SrsPageConnected />;
};

const SrsPageConnected: React.FC = () => {
  const config = useConfig();

  if (config === undefined) {
    return <Loading />;
  }

  const srsFederated = (
    <FederatedModule
      scope="srs"
      module="./ServiceRegistry"
      render={(ServiceRegistryFederated) => {
        return <ServiceRegistryFederated />;
      }}
    />
  );

  return <DevelopmentPreview> {srsFederated} </DevelopmentPreview>;
};
