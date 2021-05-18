import React, { useContext } from 'react';
import { IAppRoute } from "@app/Routes";
import { ConfigContext } from "@bf2/ui-shared";
import { ServiceDownPage } from "@app/pages";
import { DevelopmentPreview, FederatedModule } from "@app/components";

export const MicroFrontendNamePage: React.FunctionComponent<IAppRoute> = ({ path }) => {
  const config = useContext(ConfigContext);

  if (config?.serviceDown) {
    return (<ServiceDownPage/>);
  }

  return (<MicroFrontendNamePageConnected path={path}/>);
}

export const MicroFrontendNamePageConnected: React.FunctionComponent<{ path: IAppRoute['path'] }> = ({ path }) => {
  return (
    <DevelopmentPreview>
      <FederatedModule
        scope="scopeName"
        module="./MicroFrontendName"
        render={(MicroFrontendName) => {
          return (
            <MicroFrontendName/>
          );
        }}
      />
    </DevelopmentPreview>
  );
};
