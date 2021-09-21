export type InsightsType = {
  chrome: {
    init: () => void;
    identifyApp: (appId: string) => Promise<void>;
    getApp: () => string;
    getBundle: () => string;
    getEnvironment: () => 'ci' | 'qa' | 'prod' | 'stage';
    on: (type: string, callback: (event: any) => void) => () => void;
    auth?: {
      getToken(): Promise<string>;
      getUser(): Promise<UserType>;
    };
    isProd: boolean;
    isBeta: () => boolean;
    isPenTest: () => boolean;
  };
};

export type UserType = {
  entitlements: {
    [key: string]: {
      is_entitled: boolean;
      is_trial: boolean;
    };
  };
  identity: IdentityType;
};

export type IdentityType = {
  account_number: string;
  type: string;
  internal: {
    org_id: string;
    account_id: string;
  };
  user: {
    is_org_admin: boolean;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    is_active: boolean;
  };
};
