import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { RegistriesApi, Configuration, Registry } from '@rhoas/registry-management-sdk';
import { useConfig, useAuth } from '@bf2/ui-shared';
import { ServiceDownPage } from '@app/pages';
import { DevelopmentPreview, FederatedModule, Loading } from '@app/components';
import { SrPage } from './SrPage';

type ServiceRegistryParams = {
  tenantId: string;
  groupId: string;
  artifactId: string;
  version: string;
};

type SrsPageProps = {
  federatedComponent?: string;
};

export const SrsPage: React.FC<SrsPageProps> = ({ federatedComponent }) => {
  const config = useConfig();

  if (config?.serviceDown) {
    return <ServiceDownPage />;
  }

  return <SrsPageConnected federatedComponent={federatedComponent} />;
};

const SrsPageConnected: React.FC<SrsPageProps> = ({ federatedComponent }) => {
  const config = useConfig();
  const auth = useAuth();
  const {
    srs: { apiBasePath: basePath },
  } = useConfig();
  const params = useParams<ServiceRegistryParams>();
  const [registry, setRegistry] = useState<Registry>();

  useEffect(() => {
    fetchRegistries();
  }, []);

  const fetchRegistries = async () => {
    const accessToken = await auth?.kas.getToken();
    const api = new RegistriesApi(
      new Configuration({
        accessToken,
        basePath,
      })
    );
    await api.getRegistries().then((res) => {
      const response = res?.data && res.data[0];
      setRegistry(response);
    });
  };

  if (config === undefined) {
    return <Loading />;
  }

  const srsFederated = (
    <FederatedModule
      scope="srs"
      module="./ServiceRegistry"
      fallback={<Loading />}
      render={(ServiceRegistryFederated) => {
        return (
          <ServiceRegistryFederated
            params={params}
            federatedModule={federatedComponent}
            registry={registry}
            fetchRegistry={fetchRegistries}
          >
            {registry && <SrPage federatedComponent={federatedComponent} registry={registry} />}
          </ServiceRegistryFederated>
        );
      }}
    />
  );

  return <DevelopmentPreview>{srsFederated}</DevelopmentPreview>;
};
