import {
  Auth,
  Config,
  useAuth,
  useConfig,
} from "@rhoas/app-services-ui-shared";
import {
  Configuration,
  AppServicesApi,
  TermsReviewResponse,
} from "@rhoas/account-management-sdk";
import { ServiceProps, useFetch } from "@app/services/fetch";
import { useCallback, useEffect, useMemo, useRef } from "react";

export type ITermsConfig = {
  eventCode: string;
  siteCode: string;
};

export const useTermsReview = (termsConfig: ITermsConfig) => {
  const config = useConfig();
  const auth = useAuth();

  const fetchProps = useMemo(
    () => fetchTermsReviewFactory(config, auth, termsConfig),
    [auth, config, termsConfig]
  );

  return useFetch(fetchProps);
};

export const useAsyncTermsReview = (termsConfig: ITermsConfig) => {
  const config = useConfig();
  const auth = useAuth();
  const ref = useRef<TermsReviewResponse | undefined>();

  // Return a function that either returns the lazily loaded terms review, or waits for the terms review to load
  const load = useCallback(async (): Promise<TermsReviewResponse> => {
    if (ref.current !== undefined) {
      // return the cached copy
      return ref.current;
    }
    const answer = await fetchTermsReviewFactory(config, auth, termsConfig)
      .fetch()
      .then((r) => r);
    ref.current = answer;
    return answer;
  }, [auth, config, termsConfig]);

  useEffect(() => {
    // Lazy-load the terms review
    load();
  }, [config, auth, load]);
  return load;
};

const fetchTermsReviewFactory = (
  config: Config,
  auth: Auth,
  termsConfig: ITermsConfig
): ServiceProps<TermsReviewResponse> => {
  return {
    key: "selfTermsReview",
    fetch: async () => {
      const accessToken = await auth?.ams.getToken();
      const defaultApi = new AppServicesApi({
        accessToken,
        basePath: config?.ams.apiBasePath || "",
      } as Configuration);
      const response = await defaultApi.apiAuthorizationsV1SelfTermsReviewPost({
        event_code: termsConfig.eventCode,
        site_code: termsConfig.siteCode,
      });
      return response.data;
    },
  };
};
