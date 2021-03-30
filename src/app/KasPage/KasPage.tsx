import React, {useContext, useEffect, useState} from 'react';
import {useHistory, useLocation} from 'react-router';
import {InsightsContext} from "@app/utils/insights";
import {useDispatch} from 'react-redux';
import {addNotification} from '@redhat-cloud-services/frontend-components-notifications/';
import {AlertVariant} from "@patternfly/react-core";
import {FederatedModule} from "../Components/FederatedModule/FederatedModule";
import {ConfigContext} from "@app/Config/Config";
import {Loading} from "@app/Components/Loading/Loading";
import {Configuration, DefaultApi,TermsReviewResponse} from "../../openapi/ams";
import {getTermsAppURL} from "@app/utils/termsApp";
import queryString from 'query-string';

export const KasPage: React.FunctionComponent = () => {

  const insights = useContext(InsightsContext);
  const config = useContext(ConfigContext);

  const history = useHistory();
  const location = useLocation();

  const [create, setCreate] = useState<boolean>(false);
  const [termsReview, setTermsReview] = useState<TermsReviewResponse | undefined>();

  // Handle being passed ?create=true by setting the create state, then removing it from the search params
  const handleCreateParam = () => {
    const parsed = queryString.parse(location.search);
    const c = parsed['create'] === 'true';
    if (c) {
      setCreate(true);
    }
  };
  useEffect(() => {
    handleCreateParam();
  }, [create]);

  // Load the terms review state asynchronously, to avoid the user waiting when they press the Create Kafka Instance button
  const selfTermsReview = async() => {
    const accessToken = await insights.chrome.auth.getToken();
    const ams = new DefaultApi({
      accessToken,
      basePath: config?.controlPlane.amsBasePath || '',
    } as Configuration);
    setTermsReview(await ams.apiAuthorizationsV1SelfTermsReviewPost().then(resp => resp.data));
  }
  useEffect(() => {
    selfTermsReview();
  },[]);

  const onConnectInstance = async (event) => {
    if (event.id === undefined) {
      throw new Error();
    }
    history.push(`/streams/kafkas/${event.id}`);
  };

  const getConnectToInstancePath = (event) => {
    if (event.id === undefined) {
      throw new Error();
    }
    return history.createHref({pathname: `/streams/kafkas/${event.id}`});
  }

  const preCreateInstance = async (open: boolean) => {
    // if termsReview is set, we can proceed, otherwise wait for the effect to complete - the state update will cause the page to rerender
    if (termsReview) {
      if (termsReview.terms_available || termsReview.terms_required) {
        if (termsReview.redirect_url === undefined) {
          throw new Error("terms must be signed but there is no terms url");
        }
        const redirectURL = queryString.stringifyUrl({ url: window.location.href, query: { create: 'true' } });
        const url = getTermsAppURL(termsReview.redirect_url, redirectURL, window.location.href);
        window.location.href = url;
        return false;
      }
      return open;
    }
    return false;

  }

  const createDialogOpen = () => {
    return create;
  }

  const dispatch = useDispatch();

  const addAlert = (message: string, variant?: AlertVariant) => {
    dispatch(
      addNotification({
        variant: variant,
        title: message
      })
    );

  };

  if (config === undefined || termsReview === undefined) {
    return <Loading/>
  }

  const getUsername = () => insights.chrome.auth.getUser().then(user => user.identity.user.username);

  const osStreams = (
    <FederatedModule
      scope="kas"
      module="./OpenshiftStreams"
      render={(OpenshiftStreamsFederated) => {
        return (
          <OpenshiftStreamsFederated
            getToken={insights.chrome.auth.getToken}
            getUsername={getUsername}
            onConnectToInstance={onConnectInstance}
            getConnectToInstancePath={getConnectToInstancePath}
            preCreateInstance={preCreateInstance}
            createDialogOpen={createDialogOpen}
            addAlert={addAlert}
            basePath={config?.controlPlane.serviceApiBasePath}
          />
        );
      }}
    />
  );

  return osStreams;
};
