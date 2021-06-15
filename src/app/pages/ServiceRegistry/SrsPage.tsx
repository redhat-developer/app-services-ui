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

type SrsPageProps = {
  federatedComponent?: string;
};

export const SrsPage: React.FC<SrsPageProps> = ({ federatedComponent }) => {
  const config = useConfig();

  if (config?.serviceDown) {
    return <ServiceDownPage />;
  }

  return <SrsPageConnected federatedComponent={federatedComponent} />;
};

const SrsPageConnected: React.FC<SrsPageProps> = ({ federatedComponent }) => {
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
        return <ServiceRegistryFederated params={params} federatedModule={federatedComponent} />;
      }}
    />
  );

  return <DevelopmentPreview> {srsFederated} </DevelopmentPreview>;
};
