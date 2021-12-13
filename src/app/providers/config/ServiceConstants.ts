import React from "react";
import { useContext } from "react";

/**
 * Configuration for AMS
 */
export interface AmsConfig {
  termsAndConditionsEventCode: string;
  termsAndConditionsSiteCode: string;
  instanceQuotaId: string;
  trialQuotaId: string;
}

export interface ServiceConstants {
  version: string;
  kafka: {
    ams: AmsConfig;
  },
  serviceRegistry: {
    ams: AmsConfig;
  }
}

/**
 * The ConstantContext allows access to the constants for the application.
 */
export const ConstantContext: React.Context<ServiceConstants | undefined> =
  React.createContext<ServiceConstants | undefined>(undefined);

/**
 * useConstants is a custom hook that is a shorthand for useContext(ConfigContext)
 */
export const useConstants = (): ServiceConstants => {
  const answer = useContext(ConstantContext);
  if (answer === undefined) {
    throw new Error("useConstants must be used inside an ServiceConstantsContextProvider");
  }
  return answer;
}
