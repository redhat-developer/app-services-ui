import { FederatedModule } from "@app/Components/FederatedModule/FederatedModule";
import React, { FunctionComponent, useContext } from "react";
import { ConfigContext } from "@app/Config/Config";
import { Loading } from "@app/Components/Loading/Loading";
import "./QuickStartDrawerFederated.scss";

export const QuickStartDrawerFederated: FunctionComponent = ({ children }) => {

  const config = useContext(ConfigContext);

  if (config === undefined) {
    return <Loading />;
  }

  return (
    <FederatedModule
      scope="guides"
      module="./QuickStartDrawer"
      fallback={children}
      render={(QuickStartDrawerFederated) => (
        <QuickStartDrawerFederated basePath={config?.federatedModules.guides.basePath} className="mas-quickstart-drawer">
          {children}
        </QuickStartDrawerFederated>
      )}/>)
};
