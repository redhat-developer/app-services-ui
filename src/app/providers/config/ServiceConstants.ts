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



