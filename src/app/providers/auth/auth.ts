import { Context, createContext, useContext } from "react";

/**
 * The Auth object provides information about the authenticated user
 */
export type Auth = {
  /**
   * Get the username of the authenticated user
   */
  getUsername: () => Promise<string> | undefined;
  /**
   * Get the is_org_admin of the authenticated user
   */
  isOrgAdmin: () => Promise<boolean> | undefined;
  /**
   * Get the token for accessing the control plane api
   */
  getToken: () => Promise<string> | undefined;
  /**
   * Get the token for accessing the data plane api
   */
  getMASSSOToken: () => Promise<string> | undefined;
  /**
   * Get the token end point url
   */
  tokenEndPointUrl?: string;
};

/**
 * The AuthContext allows access to the Auth context
 */
export const AuthContext: Context<Auth | undefined> = createContext<
  Auth | undefined
>(undefined);

/**
 * useAuth is a custom hook that is a shorthand for useContext(AuthContext)
 */
export const useAuth = (): Auth => {
  const answer = useContext(AuthContext);
  if (answer === undefined) {
    throw new Error("must be used inside an AuthContext provider");
  }
  return answer;
};
