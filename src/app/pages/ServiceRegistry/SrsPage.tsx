import React from 'react';
import { useConfig } from '@bf2/ui-shared';
import { useParams } from 'react-router-dom';
import { ServiceDownPage } from '@app/pages';
import { DevelopmentPreview, FederatedModule, Loading } from '@app/components';

type ServiceRegistryParams = {
  tenantId: string;
  groupId: string;
  artifactId: string;
  version: string;
};

export const SrsPage: React.FC = () => {
  const config = useConfig();

  if (config?.serviceDown) {
    return <ServiceDownPage />;
  }

  return <SrsPageConnected />;
};

const SrsPageConnected: React.FC = () => {
  const config = useConfig();
  const params = useParams<ServiceRegistryParams>();

  if (config === undefined) {
    return <Loading />;
  }

  const srsFederated = (
    <FederatedModule
      scope="srs"
      module="./ServiceRegistry"
      render={(ServiceRegistryFederated) => {
        return <ServiceRegistryFederated params={params} />;
      }}
    />
  );

  return <DevelopmentPreview> {srsFederated} </DevelopmentPreview>;
};
