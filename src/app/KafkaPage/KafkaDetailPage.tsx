import React, { useContext, useEffect, useState } from 'react';
import { InsightsContext } from "@app/utils";
import { ConfigContext } from "@app/Config/Config";
import { FederatedModule } from "../Components/FederatedModule/FederatedModule";
import { AuthContext } from "@app/utils/auth/AuthContext";
import { Loading } from "@app/Components/Loading/Loading";
import { Configuration, DefaultApi } from "../../openapi/kas";
import { AlertVariant } from "@patternfly/react-core";
import { useDispatch } from 'react-redux';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/';
import { useHistory } from "react-router-dom";
import { getParams } from "@app/KafkaPage/utils";

enum KafkaUITopicModules {
  topicListDetailModule = "./Panels/TopicDetails",
  topicUpdateModule = "./Panels/UpdateTopic"
}

export const KafkaDetailPage: React.FunctionComponent = () => {

  const insights = useContext(InsightsContext);
  const config = useContext(ConfigContext);
  const [adminServerUrl, setAdminServerUrl] = useState<undefined | string>();

  const { id, topicName } = getParams();

  useEffect(() => {
    const getAdminApiUrl = async () => {
      const accessToken = await insights.chrome.auth.getToken();
      const apisService = new DefaultApi({
        accessToken,
        basePath: config?.controlPlane.serviceApiBasePath || '',
      } as Configuration);

      const kafka = await apisService.getKafkaById(id);
      setAdminServerUrl(`https://admin-server-${kafka.data.bootstrapServerHost}/rest`);
    }

    getAdminApiUrl();
  }, [insights, config, id]);

  if (config === undefined || adminServerUrl === undefined) {
    return <Loading/>
  }

  return <KafkaDetailPageContent adminServerUrl={adminServerUrl} id={id} topicName={topicName}/>

}

type KafkaDetailPageContentProps = {
  adminServerUrl: string;
  id: string;
  topicName?: string;
}

const KafkaDetailPageContent: React.FunctionComponent<KafkaDetailPageContentProps> = ({
                                                                                        adminServerUrl,
                                                                                        id,
                                                                                        topicName
                                                                                      }) => {
  const { getToken } = useContext(AuthContext);
  const history = useHistory();
  const [showUpdate, setShowUpdate] = useState<boolean>(false);
  const dispatch = useDispatch();

  const onUpdateTopic = () => {
    setShowUpdate(true);
  }

  const onCancelUpdateTopic = () => {
    setShowUpdate(false);
  }

  const onDeleteTopic = () => {
    history.push(`/streams/kafkas/${id}`);
  }

  const onSaveTopic = () => {
    setShowUpdate(false);
  }

  const addAlert = (message: string, variant?: AlertVariant) => {
    dispatch(
      addNotification({
        variant: variant,
        title: message
      })
    );

  };

  const getTopicListPath = () => {
    return history.createHref({ pathname: `/streams/kafkas/${id}` });
  }

  const onClickTopicList = () => {
    history.push(`/streams/kafkas/${id}`);
  }

  let topicModule = KafkaUITopicModules.topicListDetailModule;
  if (showUpdate) {
    topicModule = KafkaUITopicModules.topicUpdateModule
  }

  const kafkaUITopicPage = <FederatedModule
    scope="kafka"
    module={topicModule}
    render={(FederatedTopics) => <FederatedTopics
      getToken={getToken}
      apiBasePath={adminServerUrl}
      onUpdateTopic={onUpdateTopic}
      onCancelUpdateTopic={onCancelUpdateTopic}
      currentTopic={topicName}
      addAlert={addAlert}
      getTopicListPath={getTopicListPath}
      onClickTopicList={onClickTopicList}
      onDeleteTopic={onDeleteTopic}
      onSaveTopic={onSaveTopic}
    />}
  />;

  return kafkaUITopicPage;
}
