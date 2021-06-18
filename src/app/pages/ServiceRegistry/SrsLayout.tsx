import React, { useEffect, useState } from 'react';
import { Configuration, RegistriesApi, Registry } from '@rhoas/registry-management-sdk';
import { useAuth, useConfig } from '@bf2/ui-shared';
import { DevelopmentPreview, FederatedModule, Loading } from '@app/components';
import { CurrentRegistryContext } from "@app/pages/ServiceRegistry/CurrentRegistryContext";

export const SrsLayout: React.FC = ({ children }) => {
  const config = useConfig();
  const auth = useAuth();
  const {
    srs: { apiBasePath: basePath },
  } = useConfig();
  const [registry, setRegistry] = useState<Registry>();

  useEffect(() => {
    fetchRegistries();
  }, []);

  const fetchRegistries = async () => {
    const accessToken = await auth?.srs.getToken();
    const api = new RegistriesApi(
      new Configuration({
        accessToken,
        basePath,
      })
    );
    await api.getRegistries().then((res) => {
      const response = res?.data && res.data?.items[0];
      setRegistry(response);
    });
  };

  // Wait for the config and the registry to load
  if (config === undefined || registry === undefined) {
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
            <ServiceRegistryFederated registry={registry} fetchRegistry={fetchRegistries}>
              <CurrentRegistryContext.Provider value={registry}>
                {children}
              </CurrentRegistryContext.Provider>
            </ServiceRegistryFederated>
          );
        }}
      />
    </DevelopmentPreview>
  );
};
