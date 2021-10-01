import React from 'react';
import { RegistryRest } from '@rhoas/registry-management-sdk';
import { FederatedApicurioComponent } from '@app/pages/ServiceRegistry/FederatedApicurioComponent';

type DownloadArtifactsProps = {
  registry: RegistryRest;
  downloadLabel?: string;
};

export const DownloadArtifacts: React.FC<DownloadArtifactsProps> = ({ registry, downloadLabel }) => {
  return (
    <FederatedApicurioComponent
      module="./DownloadArtifactsFederated"
      registry={registry}
      instanceName={registry.name}
      downloadLinkLabel={downloadLabel}
    />
  );
};
