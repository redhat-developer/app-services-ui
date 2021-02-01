import React, {useContext, useEffect, useState} from 'react';
import {useHistory} from 'react-router';
import {InsightsContext} from "@app/utils/insights";
import {useDispatch} from 'react-redux';
import {addNotification} from '@redhat-cloud-services/frontend-components-notifications/';
import {AlertVariant} from "@patternfly/react-core";
import {FederatedModule} from "../Components/FederatedModule";
import {ConfigContext} from "@app/Config/Config";
import {Loading} from "@app/Components/Loading/Loading";

export const ControlPlanePage = () => {

  const insights = useContext(InsightsContext);
  const config = useContext(ConfigContext);

  const history = useHistory();

  const onConnectInstance = async (event) => {
    if (event.id === undefined) {
      throw new Error();
    }

    history.push(`/kafkas/${event.id}`);
  };

  const dispatch = useDispatch();

  const addAlert = (message: string, variant?: AlertVariant) => {
    dispatch(
      addNotification({
        variant: variant,
        title: message
      })
    );

  };

  if (config === undefined) {
    return <Loading />
  }

  const getUsername = () => insights.chrome.auth.getUser().then(user => user.identity.user.username);

  const osStreams = (
    <FederatedModule
      scope="mkUiFrontend"
      module="./OpenshiftStreams"
      render={(OpenshiftStreamsFederated) => {
        return (
          <OpenshiftStreamsFederated
            getToken={insights.chrome.auth.getToken}
            getUsername={getUsername}
            onConnectToInstance={onConnectInstance}
            addAlert={addAlert}
            basePath={config?.controlPlane.serviceApiBasePath}
          />
        );
      }}
    />
  );

  return (
    <FederatedModule
      scope="masGuides"
      module="./QuickStartDrawer"
      fallback={osStreams}
      render={(QuickStartDrawerFederated) => (
        <QuickStartDrawerFederated>
          {osStreams}
        </QuickStartDrawerFederated>
      )}
    />
  );
};
