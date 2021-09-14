import React from 'react';
import { useConfig, ProductType, QuotaContext } from '@rhoas/app-services-ui-shared';
import { ServiceDownPage } from '@app/pages/ServiceDown/ServiceDownPage';
import { FederatedModule, Loading } from '@app/components';
import { useQuota } from '@app/hooks';
import { useLocation } from 'react-router-dom';
import { getTermsAppURL } from '@app/utils/termsApp';
import { parse as parseQueryString, stringifyUrl } from 'query-string';
import { useAsyncTermsReview } from '@app/services/termsReview';

const useModalControl = () => {
  const loadTermsReview = useAsyncTermsReview();
  const location = useLocation();

  const shouldOpenCreateModal = async () => {
    const parsed = parseQueryString(location.search);
    const c = parsed['create'] === 'true';
    if (c) {
      const termsReview = await loadTermsReview();
      if (!termsReview.terms_required) {
        return true;
      }
    }
    return false;
  };

  const preCreateInstance = async (open: boolean) => {
    const termsReview = await loadTermsReview();
    if (termsReview.terms_available || termsReview.terms_required) {
      if (termsReview.redirect_url === undefined) {
        throw new Error('terms must be signed but there is no terms url');
      }
      const redirectURL = stringifyUrl({ url: window.location.href, query: { create: 'true' } });
      const url = getTermsAppURL(termsReview.redirect_url, redirectURL, window.location.href);
      window.location.href = url;
      return false;
    }
    return open;
  };

  return { shouldOpenCreateModal, preCreateInstance };
};

export const KasPage: React.FunctionComponent = () => {
  const config = useConfig();
  const { getQuota } = useQuota(ProductType?.kas);

  const { preCreateInstance, shouldOpenCreateModal } = useModalControl();

  const getTokenEndPointUrl = () => {
    if (config) {
      return `${config.masSso.authServerUrl}/realms/${config.masSso.realm}/protocol/openid-connect/token`;
    }
    return undefined;
  };

  return (
    <FederatedModule
      scope="kas"
      module="./OpenshiftStreams"
      fallback={<Loading />}
      render={(OpenshiftStreamsFederated) => {
        if (config?.serviceDown) {
          return <ServiceDownPage />;
        }

        return (
          <QuotaContext.Provider value={{ getQuota }}>
            <OpenshiftStreamsFederated
              preCreateInstance={preCreateInstance}
              shouldOpenCreateModal={shouldOpenCreateModal}
              tokenEndPointUrl={getTokenEndPointUrl()}
            />
          </QuotaContext.Provider>
        );
      }}
    />
  );
};

export default KasPage;
