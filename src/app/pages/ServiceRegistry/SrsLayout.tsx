import React from 'react';
import { FederatedModule, Loading } from '@app/components';
import { Registry } from "@rhoas/registry-management-sdk";

type SrsLayoutProps = {
  render: (registry: Registry) => JSX.Element
  breadcrumbId?: string
}

export const SrsLayout: React.FC<SrsLayoutProps> = ({ render, breadcrumbId }) => {
  return (
    <FederatedModule
      scope="srs"
      module="./ApicurioRegistry"
      fallback={<Loading/>}
      render={(ServiceRegistryFederated) => {
        return (
          <ServiceRegistryFederated render={render} breadcrumbId={breadcrumbId}/>
        );
      }}
    />
  );
};
