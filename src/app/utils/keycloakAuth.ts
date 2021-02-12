import Keycloak, {KeycloakConfig, KeycloakInitOptions, KeycloakInstance} from 'keycloak-js';
import Cookies from 'js-cookie';
import jwtDecode, {JwtPayload} from "jwt-decode";
import getUnixTime from "date-fns/getUnixTime";

let keycloak: KeycloakInstance | undefined;

const REFRESH_TOKEN_COOKIE_NAME = "masSSORefreshToken";
const MIN_VALIDITY = 50;


/**
 * Get keycloak instance
 *
 * @return an initiated keycloak instance or `undefined`
 * if keycloak isn't configured
 *
 */
export const getKeycloakInstance = async (config: KeycloakConfig) => {
  if (!keycloak) {
    keycloak = await init(config);
  }
  return keycloak;
}

/**
 * Initiate keycloak instance.
 *
 * Set keycloak to undefined if
 * keycloak isn't configured
 *
 */
export const init = async (config: KeycloakConfig): Promise<KeycloakInstance | undefined> => {
  const k = Keycloak(config);

  const initOptions = {
    responseMode: "query",
  } as KeycloakInitOptions;

  if (k) {
    const storedRefreshToken = Cookies.get(REFRESH_TOKEN_COOKIE_NAME);
    // parse the refresh token so we can later check for validity
    let refreshJWT: JwtPayload | undefined;
    if (storedRefreshToken) {
      try {
        refreshJWT = jwtDecode<JwtPayload>(storedRefreshToken);
      } catch {
        console.log("unable to parse refresh token from cookie")
        Cookies.remove(REFRESH_TOKEN_COOKIE_NAME);
      }
    }

    if (refreshJWT && refreshJWT.exp) {
      // if the JWT exists, and has an expiry
      const now = getUnixTime(new Date());
      if (now < refreshJWT.exp + MIN_VALIDITY) {
        // Use the refresh token if it's still valid (make sure it's valid for at least MIN_VALIDITY)
        try {
          // Perform a keycloak init without a login
          await k.init(initOptions);
          // Set the saved refresh token into Keycloak
          k.refreshToken = storedRefreshToken
          // Then force a token refresh to check if the refresh token is actually valid
          k.updateToken(-1);
          if (k.refreshToken && k.refreshToken !== storedRefreshToken) {
            // If we get back a refresh token that has changed, then save it
            Cookies.set(REFRESH_TOKEN_COOKIE_NAME, k.refreshToken);
          }
          return k;
        } catch {
          // If any of the methods above error, then perform a login
          console.log("refresh token is not valid, performing full login");
          Cookies.remove(REFRESH_TOKEN_COOKIE_NAME);
        }
      }
    }
    initOptions.onLoad = "login-required";
    await k.init(initOptions);
    if (k.refreshToken && k.refreshToken !== storedRefreshToken) {
      Cookies.set(REFRESH_TOKEN_COOKIE_NAME, k.refreshToken);
    }
    return k;
  }
  return k;
}


/**
 * Use keycloak update token function to retrieve
 * keycloak token
 *
 * @return keycloak token or empty string if keycloak
 * isn't configured
 *
 */
export const getKeyCloakToken = async (): Promise<string> => {
  await keycloak?.updateToken(MIN_VALIDITY);
  if (!keycloak?.token) {
    throw new Error("No token from keycloak!");
  }
  if (keycloak?.refreshToken) {
    // Save the most recent refresh token
    Cookies.set(REFRESH_TOKEN_COOKIE_NAME, keycloak?.refreshToken);
  }
  return keycloak?.token;
}

/**
 * logout of keycloak, clear cache and offline store then redirect to
 * keycloak login page
 *
 * @param keycloak the keycloak instance
 * @param client offix client
 *
 */
export const logout = async (keycloak: Keycloak.KeycloakInstance | undefined) => {
  if (keycloak) {
    await keycloak.logout();
  }
}
