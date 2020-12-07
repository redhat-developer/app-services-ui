import React from 'react';
import {FederatedModule} from "../../Components/FederatedModule";

export const DataPlanePage = () => {
  return (
    <FederatedModule
      scope="strimziUi"
      module="./Panels/Home.patternfly"
      render={(Home) => <Home/>}
    />
  );
}
