import React from 'react';
import { useConfig } from '@bf2/ui-shared';
import { useParams, useHistory } from 'react-router-dom';
import { ServiceDownPage } from '@app/pages';
import { FederatedModule, Loading } from '@app/components';

type ServiceRegistryParams = {
  tenantId: string;
  groupId: string;
  artifactId: string;
  version: string;
};

type SrsPageProps = {
  federatedComponent?: string;
  tenantId?: string;
};
/**
 * This is temporary code for testing. It will remove after
 */
function federatedConfig(tenantId: string, navPrefixPath: string) {
    const config: any = {
      auth: {
        options: {},
        type: 'none',
      },
      tenants: {
        api: 'http://tenant-manager-mt-apicurio-apicurio-registry.apps.zero.massopen.cloud/api/v1',
      },
      registry: {
        apis: `https://apicurio-registry-mt-apicurio-apicurio-registry.apps.zero.massopen.cloud/t/${tenantId}/apis`,
        config: {
          artifacts: {
            url: `https://apicurio-registry-mt-apicurio-apicurio-registry.apps.zero.massopen.cloud/t/${tenantId}/apis`,
          },
          auth: {
            type: 'none',
          },
          features: {
            readOnly: false,
            breadcrumbs: false,
            multiTenant: false,
          },
          ui: {
            navPrefixPath,
          },
        },
      },
    };

    return config;
  }

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

const SrPage: React.FC<SrsPageProps> = ({ federatedComponent, tenantId }) => {
  const config = useConfig();

  if (config?.serviceDown) {
    return <ServiceDownPage />;
  }

  return <SrPageConnected federatedComponent={federatedComponent} tenantId={tenantId} />;
};

const SrPageConnected: React.FC<SrsPageProps> = ({ federatedComponent, tenantId = 'tenant-15' }) => {
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

  if (config === undefined) {
    return <Loading />;
  }

  const srConfig = federatedConfig(tenantId, '');

  const srsFederated = (
    <FederatedModule
      scope="sr"
      module={currentModule}
      fallback={<Loading />}
      render={(ServiceRegistryFederated) => {
        return (
          <ServiceRegistryFederated
            config={srConfig}
            history={history}
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
