import React from 'react';
import { Config, ConfigContext } from '@rhoas/app-services-ui-shared';
import configs from '../../../../config/config.json';
import { addFederatedModulesToConfig, EnvironmentConfigs, filterEnvironmentConfig } from '@app/providers/config/utils';
import { useFeatureFlags } from "@app/providers/featureflags/FeatureFlags";
import { any } from 'modules/kafka-ui/node_modules/@types/prop-types';

declare const __webpack_public_path__: string;

// TODO move to shared-ui
/**
 * The ConfigContext allows access to the Config context
 */
 export declare const ConstantContext: React.Context<any | undefined>;


export const EmbeddedServiceConstantsProvider: React.FunctionComponent = ({ children }) => {
  // TODO use type from @rhoas/app-services-ui-shared
  const [value, setValue] = React.useState<any | undefined>(() => {});

  React.useEffect(() => {
    (async () => {
      if (value === undefined) {
        const response = await fetch(`${__webpack_public_path__}/service-constants.json`);
        const jsonConfig = await response.json();
        console.log('Done loading config', jsonConfig);
        setValue(jsonConfig);
      }
    })();
  }, []);

  return <ConstantContext.Provider value={value}>{children}</ConstantContext.Provider>;
};


