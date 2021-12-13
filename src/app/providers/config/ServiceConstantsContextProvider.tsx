import React from 'react';
import { ConstantContext, ServiceConstants } from './ServiceConstants';
import constantsFallback   from '../../../../static/configs/service-constants.json'
declare const __webpack_public_path__: string;

export const ServiceConstantsContextProvider: React.FunctionComponent = ({ children }) => {
  const [value, setValue] = React.useState<ServiceConstants | undefined>(undefined);

  React.useEffect(() => {
    (async () => {
      if (value === undefined) {
        const response = await fetch(`${__webpack_public_path__}/service-constants.json`);
        try {
          const jsonConfig = await response.json();
          console.log('Done loading constants');
          setValue(jsonConfig);
        } catch (error) {
          console.log('Using embedded constants as fallback');
          // Use embeeded config as fallback
          setValue(constantsFallback);
        }

      }
    })();
  }, [value]);

  return <ConstantContext.Provider value={value}>{children}</ConstantContext.Provider>;
};
