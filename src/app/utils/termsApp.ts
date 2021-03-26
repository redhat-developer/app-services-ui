/**
 * get the URL to TnC (Terms and Conditions) app.
 * @param baseURL is the base URL of TnC UX app;
 * @param redirectURL is the return URL if the user clicks "Accept", "Deny", or "Defer"
 * @param cancelURL is the return URL if the user clicks "Cancel".
 */
export const getTermsAppURL = (baseURL: string, redirectURL: string, cancelURL: string) => {
  const params = {
    redirect: redirectURL,
    cancelRedirect: cancelURL,
  };
  // baseURL contains params already.
  return `${baseURL}&${buildUrlParams(params)}`;
};

export const buildUrlParams = params => Object.keys(params)
  .map(key => `${key}=${encodeURIComponent(params[key])}`)
  .join('&');


