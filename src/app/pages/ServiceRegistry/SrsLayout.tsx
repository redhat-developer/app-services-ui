import React from 'react';
import { useConfig } from '@bf2/ui-shared';
import { DevelopmentPreview, FederatedModule, Loading } from '@app/components';
import { Registry } from "@rhoas/registry-management-sdk";

type SrsLayoutProps = {
  render: (registry: Registry) => JSX.Element
  breadcrumbId?: string
}

export const SrsLayout: React.FC<SrsLayoutProps> = ({ render, breadcrumbId }) => {
  const config = useConfig();

  // Wait for the config and the registry to load
  if (config === undefined) {
    return <Loading/>;
  }

  return (
    <DevelopmentPreview>
      <FederatedModule
        scope="srs"
        module="./ServiceRegistry"
        fallback={<Loading/>}
        render={(ServiceRegistryFederated) => {
          return (
            <ServiceRegistryFederated render={render} breadcrumbId={breadcrumbId} />
          );
        }}
      />
    </DevelopmentPreview>
  );
};
