import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { useAuth, useConfig } from '@bf2/ui-shared';
import { Configuration, DefaultApi, TermsReviewResponse } from '@openapi/ams';
import { getTermsAppURL } from '@app/utils/termsApp';
import queryString from 'query-string';
import { ServiceDownPage } from '@app/pages/ServiceDown/ServiceDownPage';
import { Loading, FederatedModule, DevelopmentPreview } from '@app/components';

export const KasPage: React.FunctionComponent = () => {
  const config = useConfig();

  if (config?.serviceDown) {
    return <ServiceDownPage />;
  }

  return <KasPageConnected />;
};

export const KasPageConnected: React.FunctionComponent = () => {
  const config = useConfig();
  const auth = useAuth();

  const history = useHistory();
  const location = useLocation();

  const [create, setCreate] = useState<boolean>(false);
  const [termsReview, setTermsReview] = useState<TermsReviewResponse | undefined>();

  useEffect(() => {
    // Handle being passed ?create=true by setting the create state, then removing it from the search params
    const handleCreateParam = () => {
      const parsed = queryString.parse(location.search);
      const c = parsed['create'] === 'true';
      if (c) {
        setCreate(true);
      }
    };

    handleCreateParam();
  }, [create, location.search]);

  useEffect(() => {
    // Load the terms review state asynchronously, to avoid the user waiting when they press the Create Kafka Instance button
    const selfTermsReview = async () => {
      const accessToken = await auth?.ams.getToken();
      const ams = new DefaultApi({
        accessToken,
        basePath: config?.ams.apiBasePath || '',
      } as Configuration);
      setTermsReview(
        await ams
          .apiAuthorizationsV1SelfTermsReviewPost({
            event_code: config?.ams.eventCode,
            site_code: config?.ams.siteCode,
          })
          .then((resp) => resp.data)
      );
    };

    selfTermsReview();
  }, [config?.ams.apiBasePath, auth]);

  const onConnectToRoute = async (event: any, routePath: string) => {
    if (routePath === undefined) {
      throw new Error('Route path is missing');
    }
    history.push(`/streams/${routePath}`);
  };

  const getConnectToRoutePath = (event: any, routePath: string) => {
    if (routePath === undefined) {
      throw new Error('Route path is missing');
    }
    return history.createHref({ pathname: `/streams/${routePath}` });
  };

  const preCreateInstance = async (open: boolean) => {
    // if termsReview is set, we can proceed, otherwise wait for the effect to complete - the state update will cause the page to rerender
    if (termsReview) {
      if (termsReview.terms_available || termsReview.terms_required) {
        if (termsReview.redirect_url === undefined) {
          throw new Error('terms must be signed but there is no terms url');
        }
        const redirectURL = queryString.stringifyUrl({ url: window.location.href, query: { create: 'true' } });
        const url = getTermsAppURL(termsReview.redirect_url, redirectURL, window.location.href);
        window.location.href = url;
        return false;
      }
      return open;
    }
    return false;
  };

  const createDialogOpen = () => {
    return create;
  };

  if (config === undefined || termsReview === undefined) {
    return <Loading />;
  }

  const { authServerUrl, realm } = config?.masSso || {};
  const tokenEndPointUrl = `${authServerUrl}/realms/${realm}/protocol/openid-connect/token`;

  const osStreams = (
    <FederatedModule
      scope="kas"
      module="./OpenshiftStreams"
      render={(OpenshiftStreamsFederated) => {
        return (
          <OpenshiftStreamsFederated
            onConnectToRoute={onConnectToRoute}
            getConnectToRoutePath={getConnectToRoutePath}
            preCreateInstance={preCreateInstance}
            createDialogOpen={createDialogOpen}
            tokenEndPointUrl={tokenEndPointUrl}
          />
        );
      }}
    />
  );

  return <DevelopmentPreview> {osStreams} </DevelopmentPreview>;
};
