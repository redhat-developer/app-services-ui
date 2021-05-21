import React, { useContext } from 'react';
import { useDispatch } from 'react-redux';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/';
import { AlertVariant } from '@patternfly/react-core';
import { FederatedModule } from '../../components/FederatedModule/FederatedModule';
import { AuthContext, ConfigContext, useAuth, useConfig } from '@bf2/ui-shared';
import { Loading } from '@app/components/Loading/Loading';
import { DevelopmentPreview } from '@app/components/DevelopmentPreview/DevelopmentPreview';
import { ServiceDownPage } from "@app/pages/ServiceDown/ServiceDownPage";

export const ServiceAccountsPage: React.FunctionComponent = () => {
  const config = useConfig();

  if (config?.serviceDown) {
    return (<ServiceDownPage />);
  }

  return (<ServiceAccountsPageConnected />);
}

export const ServiceAccountsPageConnected: React.FunctionComponent = () => {
  const config = useConfig();
  const auth = useAuth();
  const dispatch = useDispatch();

  const addAlert = (message: string, variant?: AlertVariant) => {
    dispatch(
      addNotification({
        variant: variant,
        title: message,
      })
    );
  };

  if (config === undefined) {
    return <Loading />;
  }

  return ( <DevelopmentPreview>
    <FederatedModule
      scope="kas"
      module="./ServiceAccounts"
      render={(ServiceAccountsFederated) => {
        return (
          <ServiceAccountsFederated
            getToken={auth?.kas.getToken}
            getUsername={auth?.getUsername}
            addAlert={addAlert}
            basePath={config?.kas.apiBasePath}
          />
        );
      }}
    />
    </DevelopmentPreview>
  );
};
