import { Config } from "@rhoas/app-services-ui-shared";

const defaultHostname = "console.redhat.com";

type FederatedModulesConfig = Config["federatedModules"];

type EnvironmentConfigWithoutFederatedModules = {
  hostnames: string[];
  fetchConfig?: boolean;
  type?: string;
  config: Omit<Config, "federatedModules">;
};

export type EnvironmentConfigsWithoutFederatedModules =
  Array<EnvironmentConfigWithoutFederatedModules>;

export const filterEnvironmentConfig = (
  environmentConfig: EnvironmentConfigsWithoutFederatedModules
): EnvironmentConfigWithoutFederatedModules => {
  const hostname = window.location.hostname;
  console.log(`Filter config for ${hostname}`);
  const possibleConfigs = environmentConfig.filter((entry) =>
    entry.hostnames.includes(hostname)
  );
  if (possibleConfigs.length > 1) {
    throw new Error(
      `Unable to find config for ${hostname}, more than one config matched ${possibleConfigs}`
    );
  } else if (possibleConfigs.length < 1) {
    // Use the default config
    const possibleDefaultConfigs = environmentConfig.filter((entry) =>
      entry.hostnames.includes(defaultHostname)
    );
    if (possibleDefaultConfigs.length > 1) {
      throw new Error(
        `Unable to load default config, more than one config matched ${possibleConfigs}`
      );
    } else if (possibleDefaultConfigs.length < 1) {
      throw new Error(`Unable to load default config, no configs matched`);
    } else {
      return possibleDefaultConfigs[0];
    }
  }
  return possibleConfigs[0];
};

export const addFederatedModulesToConfig = (
  environmentConfig: EnvironmentConfigWithoutFederatedModules,
  federatedModulesConfig: FederatedModulesConfig,
  beta: boolean
): Config => {
  const federatedModules = {} as FederatedModulesConfig;
  Object.entries(federatedModulesConfig).forEach(([k, v]) => {
    let { basePath } = v;
    let fallbackBasePath: string | undefined = undefined;
    if (environmentConfig.type !== "proxy") {
      basePath = v.fallbackBasePath;
    } else {
      fallbackBasePath = v.fallbackBasePath;
    }
    if (!beta) {
      if (basePath.startsWith("/preview")) {
        basePath = basePath.substring(5);
      }
      if (fallbackBasePath?.startsWith("/preview")) {
        fallbackBasePath = fallbackBasePath.substring(5);
      }
    }
    federatedModules[k as keyof FederatedModulesConfig] = {
      basePath,
      fallbackBasePath: fallbackBasePath!,
    };
  });
  return {
    ...environmentConfig.config,
    federatedModules,
  };
};
