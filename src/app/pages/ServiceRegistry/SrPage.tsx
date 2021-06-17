import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Registry } from '@rhoas/registry-management-sdk';
import { useConfig } from '@bf2/ui-shared';
import { ServiceDownPage } from '@app/pages';
import { FederatedModule, Loading } from '@app/components';
import { federatedConfig } from './utils';

type ServiceRegistryParams = {
  tenantId: string;
  groupId: string;
  artifactId: string;
  version: string;
};

type SrsPageProps = {
  federatedComponent?: string;
  tenantId?: string;
  registry: Registry;
};

export enum FederatedModuleActions {
  Artifacts = 'artifacts',
  ArtifactsDetails = 'artifacts-details',
  Rules = 'rules',
  ArtifactRedirect = 'artifact-redirect',
}

export enum SrFederatedModules {
  Artifacts = './FederatedArtifactsPage',
  ArtifactsDetails = './FederatedArtifactVersionPage',
  Rules = './FederatedRulesPage',
  ArtifactRedirect = './FederatedArtifactRedirectPage',
}

const SrPage: React.FC<SrsPageProps> = ({ federatedComponent, tenantId, registry }) => {
  const config = useConfig();

  if (config?.serviceDown) {
    return <ServiceDownPage />;
  }

  return <SrPageConnected federatedComponent={federatedComponent} tenantId={tenantId} registry={registry} />;
};

const SrPageConnected: React.FC<SrsPageProps> = ({ federatedComponent, registry }) => {
  const config = useConfig();
  const history = useHistory();
  const { groupId, artifactId, version } = useParams<ServiceRegistryParams>();

  const getCurrentModule = () => {
    switch (federatedComponent) {
      case FederatedModuleActions.Artifacts:
        return SrFederatedModules.Artifacts;
      case FederatedModuleActions.Rules:
        return SrFederatedModules.Rules;
      case FederatedModuleActions.ArtifactRedirect:
        return SrFederatedModules.ArtifactRedirect;
      case FederatedModuleActions.ArtifactsDetails:
        return SrFederatedModules.ArtifactsDetails;
      default:
        return SrFederatedModules.Artifacts;
    }
  };

  const currentModule = getCurrentModule();
  const federateConfig = federatedConfig(registry?.registryUrl);

  if (config === undefined) {
    return <Loading />;
  }

  const srsFederated = (
    <FederatedModule
      scope="sr"
      module={currentModule}
      fallback={<Loading />}
      render={(ServiceRegistryFederated) => {
        return (
          <ServiceRegistryFederated
            config={federateConfig}
            history={history}
            tenantId={registry?.id}
            groupId={groupId}
            artifactId={artifactId}
            version={version}
          />
        );
      }}
    />
  );

  return srsFederated;
};

export { SrPage };
