import React, {FunctionComponent, useContext} from 'react';
import {FederatedModule} from "../../Components/FederatedModule";
import {InsightsContext} from "@app/utils";
import {RouteComponentProps, useLocation, useParams} from "react-router-dom";
import {ConfigContext} from "@app/Config/Config";

type DataPlanePageParams = {
  id: string
}

export const DataPlanePage = ( {match}: RouteComponentProps<DataPlanePageParams>) => {

  const insights = useContext(InsightsContext);

  const config = useContext(ConfigContext);

  // TODO useParams is not working?
  const pathname = window.location.pathname.endsWith("/") ? window.location.pathname : `${window.location.pathname}/`;
  const parts = pathname.split("/");
  const id = parts[parts.length - 2];

  const getDataPlaneToken = () => {
    return "redhat123";
  }


  return (
    <FederatedModule
      scope="strimziUi"
      module="./Panels/Topics.patternfly"
      render={(FederatedTopics) => <FederatedTopics
        getApiOpenshiftComToken={insights.chrome.auth.getToken}
        getToken={getDataPlaneToken}
        id={id}
        apiBasePath={config.dataPlane.uiServerBasePath}
      />}
    />
  );
}
