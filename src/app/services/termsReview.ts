import { useAuth, useConfig } from '@bf2/ui-shared';
import { Configuration, DefaultApi } from '@openapi/ams';
import { useFetch } from '@app/services/fetch';

export const useTermsReview = () => {
  const config = useConfig();
  const auth = useAuth();

  return useFetch({
    key: 'selfTermsReview',
    fetch: async () => {
      const accessToken = await auth?.ams.getToken();
      const defaultApi = new DefaultApi({
        accessToken,
        basePath: config?.ams.apiBasePath || '',
      } as Configuration);
      return await defaultApi.apiAuthorizationsV1SelfTermsReviewPost({
        event_code: config?.ams.eventCode,
        site_code: config?.ams.siteCode,
      });
    },
  });
};
