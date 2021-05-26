import React, { useContext, useEffect, useState } from 'react';
import { IAppRoute, RouteProps, useHistory, useLocation } from 'react-router';
import { InsightsContext } from '@app/utils/insights';
import { useDispatch } from 'react-redux';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/';
import { AlertVariant } from '@patternfly/react-core';
import { FederatedModule } from '../Components/FederatedModule/FederatedModule';
import { ConfigContext } from '@app/Config/Config';
import { Loading } from '@app/Components/Loading/Loading';
import { Configuration, DefaultApi, TermsReviewResponse } from '../../openapi/ams';
import { getTermsAppURL } from '@app/utils/termsApp';
import queryString from 'query-string';
import { DevelopmentPreview } from '@app/Components/DevelopmentPreview/DevelopmentPreview';
import { ServiceDownPage } from "@app/ServiceDownPage/ServiceDownPage";
import getBaseName from '@app/utils/getBaseName';

export const SrPage: React.FunctionComponent<IAppRoute> = ({ path }) => {
  const config = useContext(ConfigContext);

  if (config?.serviceDown) {
    return (<ServiceDownPage />);
  }

  return (<SrPageConnected path={path} />);
}

export const SrPageConnected: React.FunctionComponent<{ path: IAppRoute['path'] }> = ({ path }) => {
  const insights = useContext(InsightsContext);
  const config = useContext(ConfigContext);
  const history = useHistory();
  const basename = history.createHref({ pathname: path });
  history.createHref({ pathname: '/' })

  if (config === undefined) {
    return <Loading />;
  }

  const getUsername = () => insights.chrome.auth.getUser().then((user) => user.identity.user.username);

  const sr = (
    <FederatedModule
      scope="sr"
      module="./OpenshiftManagedConnectors"
      render={(OpenshiftManagedConnectors) => {
        return (
          <OpenshiftManagedConnectors
            getToken={insights.chrome.auth.getToken}
            getUsername={getUsername}
            basename={basename}
          />
        );
      }}
    />
  );

  return <DevelopmentPreview> {sr} </DevelopmentPreview>;
};