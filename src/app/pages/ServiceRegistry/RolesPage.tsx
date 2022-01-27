import React, { useState, useEffect } from 'react';
import { FederatedApicurioComponent } from '@app/pages/ServiceRegistry/FederatedApicurioComponent';
import { SrsLayout } from '@app/pages/ServiceRegistry/SrsLayout';
import { useConfig, useAuth } from '@rhoas/app-services-ui-shared';
import { ServiceDownPage } from '@app/pages';
import { usePrincipal } from '@app/components';
import { AppServicesLoading } from '@rhoas/app-services-ui-components';

export const RolesPage: React.FunctionComponent = () => {
  const config = useConfig();

  if (config?.serviceDown) {
    return <ServiceDownPage />;
  }

  return <RolesPageConnected />;
};

const RolesPageConnected: React.FunctionComponent = () => {
  const [currentlyLoggedInuser, setCurrentlyLoggedInuser] = useState<string>();
  const auth = useAuth();
  const { getAllPrincipals } = usePrincipal();

  useEffect(() => {
    (async () => {
      await auth?.getUsername()?.then((user) => setCurrentlyLoggedInuser(user));
    })();
  }, [auth]);

  return (
    <SrsLayout
      breadcrumbId="srs.global_roles"
      render={(registry) => {
        if (registry === undefined || currentlyLoggedInuser === undefined) {
          return <AppServicesLoading />;
        }

        const principals = getAllPrincipals()?.filter(
          (p) => p.id !== currentlyLoggedInuser && p.id !== registry?.owner
        );

        return <FederatedApicurioComponent registry={registry} module="./FederatedRolesPage" principals={principals} />;
      }}
    />
  );
};

export default RolesPage;
