import Keycloak, { KeycloakConfig, KeycloakInitOptions, KeycloakInstance } from 'keycloak-js';
import Cookies from 'js-cookie';
import { Base64 } from 'js-base64';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import getUnixTime from 'date-fns/getUnixTime';

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
    enableLogging: false,
  } as KeycloakInitOptions;

  const refreshToken = await retrieveRefreshToken(getInsightsAccessToken);

  if (refreshToken !== undefined && config.url !== undefined) {
    // try to get an access token from the token endpoint so that we can pass it to initOptions
    const url = buildTokenEndPointUrl(config.url, config.realm);
    const body = new URLSearchParams();
    body.append('grant_type', 'refresh_token');
    body.append('refresh_token', refreshToken);
    body.append('client_id', config.clientId);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body,
    });
    if (response.status === 200) {
      console.debug('found valid access token');
      const json = await response.json();
      const accessToken = json['access_token'];
      initOptions.token = accessToken;
      initOptions.refreshToken = refreshToken;
    } else {
      console.debug('error getting access token from endpoint');
      initOptions.onLoad = 'login-required';
    }
  } else {
    const urlParams = new URLSearchParams(window.location.search);
    if (!urlParams.has('state')) {
      // only when this isn't a redirect back from MASSSO
      console.debug('did not find refresh token, will require a full login');
      initOptions.onLoad = 'login-required';
    }
  }
  const keycloak = Keycloak(config);
  await keycloak.init(initOptions);
  if (keycloak.refreshToken) {
    await storeRefreshToken(keycloak.refreshToken, getInsightsAccessToken);
  }
  return keycloak;
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

export const buildTokenEndPointUrl = (authServerUrl: string, realm: string) => {
    return `${authServerUrl}/realms/${realm}/protocol/openid-connect/token`;
};
