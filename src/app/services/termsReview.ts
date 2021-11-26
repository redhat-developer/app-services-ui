import { Auth, Config, useAuth, useConfig } from '@rhoas/app-services-ui-shared';
import { Configuration, DefaultApi, TermsReviewResponse } from '@openapi/ams';
import { useFetch } from '@app/services/fetch';
import { useEffect, useRef } from "react";

export type ITermsConfig = {
  eventCode: string;
  siteCode: string;
}

export const useTermsReview = (termsConfig: ITermsConfig) => {
  const config = useConfig();
  const auth = useAuth();

  return useFetch(fetchTermsReviewFactory(config, auth, termsConfig));
};

export const useAsyncTermsReview = (termsConfig: ITermsConfig) => {
  const config = useConfig();
  const auth = useAuth();
  const ref = useRef<TermsReviewResponse | undefined>();

  // Return a function that either returns the lazily loaded terms review, or waits for the terms review to load
  const load = async (): Promise<TermsReviewResponse> => {
    if (ref.current !== undefined) {
      // return the cached copy
      return ref.current;
    }
    const answer = await fetchTermsReviewFactory(config, auth, termsConfig).fetch().then(r => r.data);
    ref.current = answer;
    return answer;
  }

  useEffect(() => {
    // Lazy-load the terms review
    load();
  }, [config, auth]);
  return load;
}

const fetchTermsReviewFactory = (config: Config, auth: Auth, termsConfig: ITermsConfig) => {
  return {
    key: 'selfTermsReview',
    fetch: async () => {
      const accessToken = await auth?.ams.getToken();
      const defaultApi = new DefaultApi({
        accessToken,
        basePath: config?.ams.apiBasePath || '',
      } as Configuration);
      return await defaultApi.apiAuthorizationsV1SelfTermsReviewPost({
        event_code: termsConfig.eventCode,
        site_code: termsConfig.siteCode,
      });
    },
  }
}
