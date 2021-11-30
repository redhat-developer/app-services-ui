import React from 'react';
import { Registry } from '@rhoas/registry-management-sdk';
import { FederatedApicurioComponent } from './FederatedApicurioComponent';

type DownloadArtifactsProps = {
  registry: Registry;
  downloadLabel?: string;
};

export const DownloadArtifacts: React.FC<DownloadArtifactsProps> = ({ registry, downloadLabel }) => {
  return (
    <FederatedApicurioComponent
      module="./FederatedDownloadArtifacts"
      registry={registry}
      fileName={registry.name}
      downloadLinkLabel={downloadLabel}
    />
  );
};
