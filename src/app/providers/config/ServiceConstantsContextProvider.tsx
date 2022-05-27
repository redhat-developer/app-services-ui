import { ConstantContext, ServiceConstants } from "./ServiceConstants";
import constantsFallback from "../../../../static/configs/service-constants.json";
import { FunctionComponent } from "react";

export const ServiceConstantsContextProvider: FunctionComponent = ({
  children,
}) => {
  return (
    <ConstantContext.Provider value={constantsFallback as ServiceConstants}>
      {children}
    </ConstantContext.Provider>
  );
};
