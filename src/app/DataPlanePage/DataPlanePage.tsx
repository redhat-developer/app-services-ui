import React, { useContext, useState } from 'react';
import { InsightsContext } from "@app/utils";
import { ConfigContext } from "@app/Config/Config";
import { FederatedModule } from "../Components/FederatedModule/FederatedModule";
import { AuthContext } from "@app/utils/auth/AuthContext";
import { Loading } from "@app/Components/Loading/Loading";

export const DataPlanePage: React.FunctionComponent = () => {

  const insights = useContext(InsightsContext);
  const config = useContext(ConfigContext);
  const { getToken } = useContext(AuthContext);
  const [showCreateTopic, setShowCreateTopic] = useState(false);

  // TODO useParams is not working?
  const pathname = window.location.pathname.endsWith("/") ? window.location.pathname : `${window.location.pathname}/`;
  const parts = pathname.split("/");
  const id = parts[parts.length - 2];

  if (config === undefined) {
    return <Loading/>
  }

  const onCreateTopic = () => {
    setShowCreateTopic(true);
  }

  const onCloseCreateTopic = () => {
    console.log("on close");
    setShowCreateTopic(false);
  }

  const createTopicPage = <FederatedModule
    scope="strimziUi"
    module="./Panels/CreateTopic.patternfly"
    render={(FederatedTopics) => <FederatedTopics
      getApiOpenshiftComToken={insights.chrome.auth.getToken}
      getToken={getToken}
      id={id}
      apiBasePath={config?.dataPlane.uiServerBasePath}
      onCloseCreateTopic={onCloseCreateTopic}
    />}
  />;

  const topicListPage = <FederatedModule
    scope="strimziUi"
    module="./Panels/Topics.patternfly"
    render={(FederatedTopics) => <FederatedTopics
      getApiOpenshiftComToken={insights.chrome.auth.getToken}
      getToken={getToken}
      id={id}
      apiBasePath={config?.dataPlane.uiServerBasePath}
      onCreateTopic={onCreateTopic}
    />}
  />;

  if (showCreateTopic) {
    return createTopicPage;
  } else {
    return topicListPage;
  }
}
