import React from 'react';
import { ConstantContext, ServiceConstants } from './ServiceConstants';

declare const __webpack_public_path__: string;

export const ServiceConstantsContextProvider: React.FunctionComponent = ({ children }) => {
  const [value, setValue] = React.useState<ServiceConstants | undefined>(undefined);

  React.useEffect(() => {
    (async () => {
      if (value === undefined) {
        const response = await fetch(`${__webpack_public_path__}/service-constants.json`);
        const jsonConfig = await response.json();
        console.log('Done loading config', jsonConfig);
        setValue(jsonConfig);
      }
    })();
  }, [value]);

  return <ConstantContext.Provider value={value}>{children}</ConstantContext.Provider>;
};


