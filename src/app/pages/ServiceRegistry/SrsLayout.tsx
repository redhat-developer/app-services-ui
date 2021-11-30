import React from 'react';
import { FederatedModule, KasModalLoader } from '@app/components';
import { Registry } from '@rhoas/registry-management-sdk';
import { AppServicesLoading } from '@rhoas/app-services-ui-components';
import { useMASToken } from '@app/hooks';
import {DownloadArtifacts} from './DownloadArtifacts';

type SrsLayoutProps = {
  render: (registry: Registry) => JSX.Element;
  breadcrumbId?: string;
  artifactId?: string;
};

export const SrsLayout: React.FC<SrsLayoutProps> = ({ render, breadcrumbId, artifactId }) => {
  const { getTokenEndPointUrl } = useMASToken();
  return (
    <FederatedModule
      scope="srs"
      module="./ApicurioRegistry"
      fallback={<AppServicesLoading />}
      render={(ServiceRegistryFederated) => {
        return (
          <KasModalLoader>
            <ServiceRegistryFederated
              render={render}
              breadcrumbId={breadcrumbId}
              tokenEndPointUrl={getTokenEndPointUrl()}
              artifactId={artifactId}
              renderDownloadArtifacts={(registry:Registry, downloadLabel?:string)=><DownloadArtifacts registry={registry} downloadLabel={downloadLabel}/>}
            />
          </KasModalLoader>
        );
      }}
    />
  );
};
