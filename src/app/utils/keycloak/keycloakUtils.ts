import Keycloak, { KeycloakConfig, KeycloakInitOptions, KeycloakInstance } from "keycloak-js";
import Cookies from "js-cookie";
import { Base64 } from "js-base64";
import jwtDecode, { JwtPayload } from "jwt-decode";
import getUnixTime from "date-fns/getUnixTime";




const REFRESH_TOKEN_COOKIE_NAME = 'mrt';
const MIN_VALIDITY = 50;
type StoredToken = {
  refreshToken: string;
  rhUserId: string;
};


/**
 * Initiate keycloak instance.
 *
 * Set keycloak to undefined if
 * keycloak isn't configured
 *
 */
export const initKeycloak = async (
  config: KeycloakConfig,
  getInsightsAccessToken: () => Promise<string>
): Promise<KeycloakInstance> => {
  const initOptions = {
    responseMode: 'query',
    enableLogging: true,
  } as KeycloakInitOptions;

  const refreshToken = await retrieveRefreshToken(getInsightsAccessToken);

  const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  if (refreshToken) {
    const rk = Keycloak(config);

    // Use the refresh token
    try {
      // Perform a keycloak init without a login
      await rk.init(initOptions);
      // Set the saved refresh token into Keycloak
      rk.refreshToken = refreshToken;
      // Hack to ensure that the refresh token is properly set on the objet
      await sleep(100);
      // Then force a token refresh to check if the refresh token is actually valid
      await rk.updateToken(-1);
      return rk;
    } catch (e) {
      clearRefreshToken();
      console.debug("Triggering MASSSO logout because of error with existing refresh token: " + e);
      await logout(rk);
    }
  }
  const lk = Keycloak(config);
  initOptions.onLoad = 'login-required';
  await lk.init(initOptions);
  if (lk.refreshToken) {
    await storeRefreshToken(lk.refreshToken, getInsightsAccessToken);
  }
  return lk;
};

const retrieveRefreshToken = async (getInsightsAccessToken: () => Promise<string>): Promise<string | undefined> => {
  const encoded = Cookies.get(REFRESH_TOKEN_COOKIE_NAME);
  if (encoded === undefined) {
    return undefined;
  }
  const storedToken = Base64.decode(encoded);
  const storedRefreshToken = (JSON.parse(storedToken) as unknown) as StoredToken;
  // parse the refresh token so we can later check for validity
  let refreshJWT: JwtPayload | undefined;
  try {
    refreshJWT = jwtDecode<JwtPayload>(storedRefreshToken.refreshToken);
  } catch {
    clearRefreshToken();
    return undefined;
  }

  // if the JWT exists, and has an expiry
  if (refreshJWT === undefined || refreshJWT.exp === undefined) {
    clearRefreshToken();
    return undefined;
  }
  const now = getUnixTime(new Date());
  if (now > refreshJWT.exp + MIN_VALIDITY) {
    // the token is invalid
    clearRefreshToken();
    return undefined;
  }
  const insightsToken = await getInsightsAccessToken();
  const insightsJWT = jwtDecode<JwtPayload>(insightsToken);
  if (insightsJWT['account_id'] !== storedRefreshToken.rhUserId) {
    clearRefreshToken();
    return undefined;
  }
  return storedRefreshToken.refreshToken;
};

const clearRefreshToken = () => {
  console.debug('clearing stored refresh token');
  Cookies.remove(REFRESH_TOKEN_COOKIE_NAME);
};

const storeRefreshToken = async (refreshToken: string, getInsightsAccessToken: () => Promise<string>) => {
  const insightsToken = await getInsightsAccessToken();
  const insightsJWT = jwtDecode<JwtPayload>(insightsToken);
  const rhUserId = insightsJWT['account_id'];
  const storedToken = JSON.stringify({
    refreshToken,
    rhUserId,
  } as StoredToken);
  const encoded = Base64.encode(storedToken);
  console.debug('storing refresh token');
  Cookies.set(REFRESH_TOKEN_COOKIE_NAME, encoded);
};

/**
 * Use keycloak update token function to retrieve
 * an access token. If an unexpired access token
 * is in memory, it will return it, otherwise it
 * will use the refresh token to get a new access
 * token.
 *
 * It will also save the refresh token into a cookies
 *
 * @return keycloak token
 * @throws error if a token is not available
 *
 */
export const getAccessToken = async (keycloak: KeycloakInstance, getInsightsAccessToken: () => Promise<string>): Promise<string> => {
  await keycloak.updateToken(MIN_VALIDITY);
  if (!keycloak.token || !keycloak.tokenParsed) {
    throw new Error('No token from keycloak!');
  }
  const insightsToken = await getInsightsAccessToken();
  const insightsJWT = jwtDecode<JwtPayload>(insightsToken);
  const accountId = insightsJWT['account_id'];
  const rhUserId = keycloak.tokenParsed['rh-user-id'];
  if (accountId !== rhUserId) {
    console.debug(`Triggering MASSSO logout because sso.redhat.com account_id claim does not match the MASSSO rh-user-id claim. account_id: ${accountId}, rh-user-id ${rhUserId}`);
    await logout(keycloak);
    return '';
  }
  if (keycloak.refreshToken) {
    // Save the most recent refresh token
    await storeRefreshToken(keycloak.refreshToken, getInsightsAccessToken);
  }
  return keycloak.token;
};

/**
 * logout of keycloak, clear cache and offline store then redirect to
 * keycloak login page
 *
 * @param k the keycloak instance
 * @param client offix client
 *
 */
const logout = async (k: Keycloak.KeycloakInstance | undefined) => {
  if (k) {
    console.debug('Performing MASSSO logout');
    await k.logout();
  }
};
