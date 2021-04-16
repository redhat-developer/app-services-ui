import React, { useContext } from 'react';
import { InsightsContext } from '@app/utils/insights';
import { useDispatch } from 'react-redux';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/';
import { AlertVariant } from '@patternfly/react-core';
import { FederatedModule } from '../Components/FederatedModule/FederatedModule';
import { ConfigContext } from '@app/Config/Config';
import { Loading } from '@app/Components/Loading/Loading';
import { DevelopmentPreview } from '@app/Components/DevelopmentPreview/DevelopmentPreview';

export const ServiceAccountsPage: React.FunctionComponent = () => {
  const insights = useContext(InsightsContext);
  const config = useContext(ConfigContext);
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

  const getUsername = () => insights.chrome.auth.getUser().then((user) => user.identity.user.username);

  return ( <DevelopmentPreview>
    <FederatedModule
      scope="kas"
      module="./ServiceAccounts"
      render={(ServiceAccountsFederated) => {
        return (
          <ServiceAccountsFederated
            getToken={insights.chrome.auth.getToken}
            getUsername={getUsername}
            addAlert={addAlert}
            basePath={config?.controlPlane.serviceApiBasePath}            
          />
        );
      }}
    />
    </DevelopmentPreview>
  );
};
