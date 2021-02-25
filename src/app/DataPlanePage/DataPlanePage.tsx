import React, { useContext, useEffect, useState } from 'react';
import { InsightsContext } from "@app/utils";
import { ConfigContext } from "@app/Config/Config";
import { FederatedModule } from "../Components/FederatedModule/FederatedModule";
import { AuthContext } from "@app/utils/auth/AuthContext";
import { Loading } from "@app/Components/Loading/Loading";
import { DefaultApi } from "../../openapi";

export const DataPlanePage: React.FunctionComponent = () => {

  const insights = useContext(InsightsContext);
  const config = useContext(ConfigContext);
  const { getToken } = useContext(AuthContext);
  const [showCreateTopic, setShowCreateTopic] = useState(false);
  const [adminServerUrl, setAdminServerUrl] = useState<undefined | string>();

  // TODO useParams is not working?
  const pathname = window.location.pathname.endsWith("/") ? window.location.pathname : `${window.location.pathname}/`;
  const parts = pathname.split("/");
  const id = parts[parts.length - 2];

  const getAdminApiUrl = async () => {
    const accessToken = await insights.chrome.auth.getToken();
    const apisService = new DefaultApi({
      accessToken,
      basePath: config?.controlPlane.serviceApiBasePath || '',
    });

    const kafka = await apisService.getKafkaById(id);
    setAdminServerUrl(`https://admin-server-${kafka.data.bootstrapServerHost}/rest`);
  }

  useEffect(() => {
    getAdminApiUrl();
  },[insights, config]);

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
      getToken={getToken}
      apiBasePath={adminServerUrl}
      onCloseCreateTopic={onCloseCreateTopic}
    />}
  />;

  const topicListPage = <FederatedModule
    scope="strimziUi"
    module="./Panels/Topics.patternfly"
    render={(FederatedTopics) => <FederatedTopics
      getToken={getToken}
      apiBasePath={adminServerUrl}
      onCreateTopic={onCreateTopic}
    />}
  />;

  if (showCreateTopic) {
    return createTopicPage;
  } else {
    return topicListPage;
  }
}
