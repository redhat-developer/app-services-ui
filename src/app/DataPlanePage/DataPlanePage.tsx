
import React from 'react';
import {FederatedModule} from "../../Components/FederatedModule";

export class DataPlanePage extends React.Component {
  render() {
    return (
      <FederatedModule
        scope="strimziUi"
        module="./Home"
        render={(Home) => <Home />}
      />
    );
  }
}
