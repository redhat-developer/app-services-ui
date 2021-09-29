import React from 'react';
import {useHistory} from 'react-router-dom';
import { RegistryRest } from '@rhoas/registry-management-sdk';
import { FederatedModule } from '@app/components';
import { ConfigType, createApicurioConfig } from '@app/pages/ServiceRegistry/utils';
import { useAuth, useBasename, useConfig } from '@rhoas/app-services-ui-shared';

type DownloadArtifactsProps={
    registry: RegistryRest;
    downloadLabel?:string;
}

export const DownloadArtifacts: React.FC<DownloadArtifactsProps> = ({registry, downloadLabel}) => {
    let federateConfig: ConfigType;
    const auth = useAuth(); 
    const config=useConfig();
    const history = useHistory();
    const basename = useBasename();
    const getToken = auth?.apicurio_registry.getToken;

    if (config === undefined || registry === undefined) {
        return <></>;
      }

    if (getToken && basename && registry?.registryUrl) {
        federateConfig = createApicurioConfig(
          registry.registryUrl,
          `${basename.getBasename()}/t/${registry?.id}`,
          getToken
        );
    }

  return (
    <FederatedModule
      scope="apicurio_registry"
      module="./DownloadArtifactsFederated"
      fallback={null}
      render={(DownloadArtifactsFederated) => {
        return <DownloadArtifactsFederated config={federateConfig} history={history} instanceName={registry.name} downloadLinkLabel={downloadLabel}/>;
      }}
    />
  );
};
