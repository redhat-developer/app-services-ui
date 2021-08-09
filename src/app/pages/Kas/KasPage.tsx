import React from 'react';
import { useConfig, ProductType, QuotaContext } from '@bf2/ui-shared';
import { ServiceDownPage } from '@app/pages/ServiceDown/ServiceDownPage';
import { FederatedModule, Loading } from '@app/components';
import { useHistory, useLocation } from 'react-router-dom';
import { getTermsAppURL } from '@app/utils/termsApp';
import { parse as parseQueryString, stringifyUrl } from 'query-string';
import { useTermsReview } from '@app/services/termsReview';
import { useQuota } from '@app/hooks';

export const KasPage: React.FunctionComponent = () => {
  const config = useConfig();
  const history = useHistory();
  const location = useLocation();
  const termsReview = useTermsReview();
  const { getQuota } = useQuota(ProductType?.kas);

  return (
    <FederatedModule
      scope="kas"
      module="./OpenshiftStreams"
      fallback={<Loading />}
      render={(OpenshiftStreamsFederated) => {
        const shouldOpenCreateModal = async () => {
          const parsed = parseQueryString(location.search);
          const c = parsed['create'] === 'true';
          if (c) {
            if (termsReview.data?.terms_required === false) {
              history.replace({
                search: '',
              });
              return true;
            }
          }
          return false;
        };

        const preCreateInstance = async (open: boolean) => {
          if (termsReview.data?.terms_available || termsReview.data?.terms_required) {
            if (termsReview.data?.redirect_url === undefined) {
              throw new Error('terms must be signed but there is no terms url');
            }
            const redirectURL = stringifyUrl({ url: window.location.href, query: { create: 'true' } });
            const url = getTermsAppURL(termsReview.data?.redirect_url, redirectURL, window.location.href);
            window.location.href = url;
            return false;
          }
          return open;
        };

        const getTokenEndPointUrl = () => {
          if (config) {
            return `${config.masSso.authServerUrl}/realms/${config.masSso.realm}/protocol/openid-connect/token`;
          }
          return undefined;
        };

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
