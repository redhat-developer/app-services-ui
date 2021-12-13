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
 * The ConfigContext allows access to the Config context
 */
 export declare const ConstantContext: React.Context<ServiceConstants | undefined>;




