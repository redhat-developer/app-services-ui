import { Auth, Config, useAuth, useConfig } from '@bf2/ui-shared';
import { Configuration, DefaultApi, TermsReviewResponse } from '@openapi/ams';
import { useFetch } from '@app/services/fetch';
import { useEffect, useRef } from "react";

export const useTermsReview = () => {
  const config = useConfig();
  const auth = useAuth();

  return useFetch(fetchTermsReviewFactory(config, auth));
};

export const useAsyncTermsReview = () => {
  const config = useConfig();
  const auth = useAuth();
  const ref = useRef<TermsReviewResponse | undefined>();

  // Return a function that either returns the lazily loaded terms review, or waits for the terms review to load
  const load = async (): Promise<TermsReviewResponse> => {
    if (ref.current !== undefined) {
      // return the cached copy
      return ref.current;
    }
    const answer = await fetchTermsReviewFactory(config, auth).fetch().then(r => r.data);
    ref.current = answer;
    return answer;
  }

  useEffect(() => {
    // Lazy-load the terms review
    load();
  }, [config, auth]);
  return load;
}

const fetchTermsReviewFactory = (config: Config, auth: Auth) => {
  return {
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
  }
}
