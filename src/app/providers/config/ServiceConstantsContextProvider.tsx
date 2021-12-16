import React from 'react';
import { ConstantContext, ServiceConstants } from './ServiceConstants';
import constantsFallback   from '../../../../static/configs/service-constants.json'

export const ServiceConstantsContextProvider: React.FunctionComponent = ({ children }) => {
  return <ConstantContext.Provider value={constantsFallback as ServiceConstants}>{children}</ConstantContext.Provider>;
};
