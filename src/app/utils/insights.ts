import React from 'react';

export type InsightsType = {
  chrome: {
    init: () => void;
    identifyApp: (appId: string) => Promise<void>;
    getApp: () => string;
    getBundle: () => string;
    getEnvironment: () => 'ci' | 'qa' | 'prod' | 'stage';
    on: (type: string, callback: ((event: any) => void)) => void;
    auth: {
      getToken(): Promise<string>;
    };
    isProd: boolean;
    isBeta: () => boolean;
    isPenTest: () => boolean;
  };
};

export const InsightsContext = React.createContext({} as InsightsType);
