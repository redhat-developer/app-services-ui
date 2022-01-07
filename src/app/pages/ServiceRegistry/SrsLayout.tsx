import React, { VoidFunctionComponent } from 'react';
import { FederatedModule, KasModalLoader } from '@app/components';
import { Registry } from '@rhoas/registry-management-sdk';
import { AppServicesLoading } from '@rhoas/app-services-ui-components';
import { useMASToken } from '@app/hooks';
import { DownloadArtifacts } from './DownloadArtifacts';

type SrsLayoutProps = {
  render: (registry: Registry) => JSX.Element;
  breadcrumbId?: string;
  artifactId?: string;
};

export const SrsLayout: React.FC<SrsLayoutProps> = (props) => {
  return (
    <FederatedModule
      scope="srs"
      module="./ApicurioRegistry"
      fallback={<AppServicesLoading />}
      render={(component) => <SrsLayoutConnected Component={component} {...props} />}
    />
  );
};

const SrsLayoutConnected: VoidFunctionComponent<{ Component: React.LazyExoticComponent<any> } & SrsLayoutProps> = ({
  Component,
  render,
  breadcrumbId,
  artifactId,
}) => {
  const { getTokenEndPointUrl } = useMASToken();

  return (
    <KasModalLoader>
      <Component
        render={render}
        breadcrumbId={breadcrumbId}
        tokenEndPointUrl={getTokenEndPointUrl()}
        artifactId={artifactId}
        renderDownloadArtifacts={(registry: Registry, downloadLabel?: string) => (
          <DownloadArtifacts registry={registry} downloadLabel={downloadLabel} />
        )}
      />
    </KasModalLoader>
  );
};
