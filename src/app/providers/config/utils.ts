import { Config } from '@rhoas/app-services-ui-shared';

const defaultHostname = 'console.redhat.com';

type FederatedModulesConfig = Config['federatedModules'];

type EnvironmentConfig = {
  hostnames: string[];
  fetchConfig?: boolean;
  type?: string;
  config: Omit<Config, 'federatedModules'>;
};

export type EnvironmentConfigs = Array<EnvironmentConfig>;

export const filterEnvironmentConfig = (environmentConfig: EnvironmentConfigs): EnvironmentConfig => {
  const hostname = window.location.hostname;
  console.log(`Filter config for ${hostname}`);
  const possibleConfigs = environmentConfig.filter((entry) => entry.hostnames.includes(hostname));
  if (possibleConfigs.length > 1) {
    throw new Error(`Unable to find config for ${hostname}, more than one config matched ${possibleConfigs}`);
  } else if (possibleConfigs.length < 1) {
    // Use the default config
    const possibleDefaultConfigs = environmentConfig.filter((entry) => entry.hostnames.includes(defaultHostname));
    if (possibleDefaultConfigs.length > 1) {
      throw new Error(`Unable to load default config, more than one config matched ${possibleConfigs}`);
    } else if (possibleDefaultConfigs.length < 1) {
      throw new Error(`Unable to load default config, no configs matched`);
    } else {
      return possibleDefaultConfigs[0];
    }
  }
  return possibleConfigs[0];
};

export const addFederatedModulesToConfig = (
  environmentConfig: EnvironmentConfig,
  federatedModulesConfig: FederatedModulesConfig
): Config => {
  if (environmentConfig.type !== 'proxy') {
    const federatedModules = {} as FederatedModulesConfig;
    Object.entries(federatedModulesConfig).forEach(([k, v]) => {
      federatedModules[k] = {
        basePath: v.fallbackBasePath,
      };
    });
    return {
      ...environmentConfig.config,
      federatedModules,
    };
  }
  return {
    ...environmentConfig.config,
    federatedModules: federatedModulesConfig,
  };
};
