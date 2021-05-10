import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { InsightsContext } from '@app/utils/insights';
import { useDispatch } from 'react-redux';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/';
import { AlertVariant } from '@patternfly/react-core';
import { FederatedModule } from '../../Components/FederatedModule/FederatedModule';
import { ConfigContext } from '@app/Config/Config';
import { Loading } from '@app/Components/Loading/Loading';
import { Configuration, DefaultApi, TermsReviewResponse } from '../../../openapi/ams';
import { getTermsAppURL } from '@app/utils/termsApp';
import queryString from 'query-string';
import { DevelopmentPreview } from '@app/Components/DevelopmentPreview/DevelopmentPreview';
import { ServiceDownPage } from "@app/ServiceDownPage/ServiceDownPage";

export const CosPage: React.FunctionComponent = () => {
  const config = useContext(ConfigContext);

  if (config?.serviceDown) {
    return (<ServiceDownPage />);
  }

  return (<CosPageConnected />);
}

export const CosPageConnected: React.FunctionComponent = () => {
  const insights = useContext(InsightsContext);
  const config = useContext(ConfigContext);



  if (config === undefined) {
    return <Loading />;
  }

  const getUsername = () => insights.chrome.auth.getUser().then((user) => user.identity.user.username);

  const osStreams = (
    <FederatedModule
      scope="cos"
      module="./TODO"
      render={(OpenshiftStreamsFederated) => {
        return (
          <OpenshiftStreamsFederated
            getToken={insights.chrome.auth.getToken}
            getUsername={getUsername}
          />
        );
      }}
    />
  );

  return <DevelopmentPreview> {osStreams} </DevelopmentPreview>;
};
