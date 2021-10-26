import React from 'react';
import { FederatedModule } from '@app/components';
import { Registry } from '@rhoas/registry-management-sdk';
import { AppServicesLoading } from '@rhoas/app-services-ui-components';
import { useMASToken } from '@app/hooks';

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
          <ServiceRegistryFederated
            render={render}
            breadcrumbId={breadcrumbId}
            tokenEndPointUrl={getTokenEndPointUrl()}
            artifactId={artifactId}
          />
        );
      }}
    />
  );
};
