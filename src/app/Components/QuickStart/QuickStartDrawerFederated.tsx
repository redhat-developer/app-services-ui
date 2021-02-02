import {FederatedModule} from "@app/Components/FederatedModule";
import React, {FunctionComponent, useContext} from "react";
import {QuickStartDrawerContext} from "@app/Components/QuickStart/QuickStartDrawerContext";

export const QuickStartDrawerFederated: FunctionComponent = ({children}) => {
  const { activeQuickStartID, setActiveQuickStartID } = useContext(QuickStartDrawerContext);
  return (
    <FederatedModule
      scope="guides"
      module="./QuickStartDrawer"
      fallback={children}
      render={(QuickStartDrawerFederated) => (
        <QuickStartDrawerFederated activeQuickStartID={activeQuickStartID} setActiveQuickStartID={setActiveQuickStartID}>
          {children}
        </QuickStartDrawerFederated>
      )}/>)
};
