import { FederatedApicurioComponent } from '@app/pages/ServiceRegistry/FederatedApicurioComponent';
import React from 'react';
import { SrsLayout } from '@app/pages/ServiceRegistry/SrsLayout';
import { useConfig } from '@bf2/ui-shared';
import { ServiceDownPage } from '@app/pages';

export const Artifacts: React.FunctionComponent = () => {
  const config = useConfig();

  if (config?.serviceDown) {
    return <ServiceDownPage />;
  }

  return <ArtifactsConnected />;
};

const ArtifactsConnected: React.FunctionComponent = () => {
  return (
    <SrsLayout
      breadcrumbId="srs.artifacts"
      render={(registry) => <FederatedApicurioComponent module="./FederatedArtifactsPage" registry={registry} />}
    />
  );
};
