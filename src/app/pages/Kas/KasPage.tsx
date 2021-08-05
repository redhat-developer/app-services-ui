import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
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
  const location = useLocation();

  const [create, setCreate] = useState<boolean>(false);
  const [termsReview, setTermsReview] = useState<TermsReviewResponse | undefined>();
  const [orgId, setOrgId] = useState<string | undefined>('');

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

      await ams
        .apiAuthorizationsV1SelfTermsReviewPost({
          event_code: config?.ams.eventCode,
          site_code: config?.ams.siteCode,
        })
        .then((resp) => setTermsReview(resp.data));
    };

    selfTermsReview();
  }, [config?.ams.apiBasePath, auth]);

  useEffect(() => {
    const getCurrentAccount = async () => {
      const accessToken = await auth?.ams.getToken();
      const ams = new DefaultApi({
        accessToken,
        basePath: config?.ams.apiBasePath || '',
      } as Configuration);

      await ams.apiAccountsMgmtV1CurrentAccountGet().then((account) => {
        const orgID = account?.data?.organization?.id;
        setOrgId(orgID);
      });
    };

    getCurrentAccount();
  }, [config?.ams.apiBasePath, auth]);

  const getAMSQuota = async () => {
    let filteredQuota;
    let isServiceDown = false;
    if (orgId) {
      const {
        ams: { quotaId, trialQuotaId },
      } = config;
      const accessToken = await auth?.ams.getToken();
      const ams = new DefaultApi({
        accessToken,
        basePath: config?.ams.apiBasePath || '',
      } as Configuration);

      await ams
        .apiAccountsMgmtV1OrganizationsOrgIdQuotaCostGet(orgId)
        .then((res) => {
          const { allowed, consumed, quota_id } = res?.data?.items?.filter(
            (q) => q.quota_id.trim() === quotaId || q.quota_id.trim() === trialQuotaId
          )[0];

          filteredQuota = {
            allowed,
            consumed,
            remaining: allowed - consumed,
            isTrial: quota_id === trialQuotaId,
          };
        })
        .catch((error) => {
          isServiceDown = true;
        });
    }
    return { ...filteredQuota, isServiceDown };
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
            preCreateInstance={preCreateInstance}
            createDialogOpen={createDialogOpen}
            tokenEndPointUrl={tokenEndPointUrl}
            getQuota={getAMSQuota}
          />
        );
      }}
    />
  );

  return <DevelopmentPreview> {osStreams} </DevelopmentPreview>;
};

export default KasPage;
