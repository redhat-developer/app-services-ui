import React, { useContext, } from 'react';
import { IAppRoute } from "@app/Routes";
import { ConfigContext } from "@bf2/ui-shared";
import { ServiceDownPage } from "@app/pages";
import { DevelopmentPreview, FederatedModule, Loading } from "@app/components";

export const SrPage: React.FunctionComponent<IAppRoute> = ({ path }) => {
  const config = useContext(ConfigContext);

  if (config?.serviceDown) {
    return (<ServiceDownPage />);
  }

  return (<SrPageConnected path={path} />);
}

export const SrPageConnected: React.FunctionComponent<{ path: IAppRoute['path'] }> = ({ path }) => {
    const sr = (
    <FederatedModule
      scope="kas"
      module="./ServiceRegistry"
      render={(ServiceRegistryService) => {
        return (
          <ServiceRegistryService />
        );
      }}
    />
  );

  return <DevelopmentPreview> {sr} </DevelopmentPreview>;
};
