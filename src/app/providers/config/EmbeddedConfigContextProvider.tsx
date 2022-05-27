import { FunctionComponent, useEffect, useState } from "react";
import { Config, ConfigContext } from "@rhoas/app-services-ui-shared";
import configs from "../../../../config/config.json";
import {
  addFederatedModulesToConfig,
  EnvironmentConfigsWithoutFederatedModules,
  filterEnvironmentConfig,
} from "@app/providers/config/utils";
import { useFeatureFlags } from "@app/providers/featureflags/FeatureFlags";

export const EmbeddedConfigProvider: FunctionComponent = ({ children }) => {
  const { beta } = useFeatureFlags();

  const [value, setValue] = useState<Config | undefined>(() => {
    const configFromJson: EnvironmentConfigsWithoutFederatedModules =
      configs.config;
    const environmentConfig = filterEnvironmentConfig(configFromJson);
    if (environmentConfig.fetchConfig) {
      return undefined;
    }
    const config = addFederatedModulesToConfig(
      environmentConfig,
      configs.federatedModules,
      beta
    );
    console.log("Done loading config", config);
    return config;
  });

  useEffect(() => {
    (async () => {
      if (value === undefined) {
        const response = await fetch(`${__webpack_public_path__}config.json`);
        const jsonConfig = await response.json();
        const environmentConfig = filterEnvironmentConfig(jsonConfig.config);
        const config = addFederatedModulesToConfig(
          environmentConfig,
          jsonConfig.federatedModules,
          beta
        );
        console.debug("Done loading config", config);
        setValue(config);
      }
    })();
  }, [beta, value]);
  return (
    <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
  );
};
