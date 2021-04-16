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
import AccessDeniedPage from '@app/AccessDeniedPage/AccessDeniedPage';
import { DevelopmentPreview } from '@app/Components/DevelopmentPreview/DevelopmentPreview';

enum KafkaUITopicModules {
  topicListModule = "./Panels/Topics",
  topicListDetailModule = "./Panels/TopicDetails",
  topicCreateModule = "./Panels/CreateTopic",
  topicUpdateModule = "./Panels/UpdateTopic"
}

export const KafkaPage: React.FunctionComponent = () => {

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

  return <KafkaPageContent adminServerUrl={adminServerUrl} id={id} topicName={topicName}/>

}

type KafkaPageContentProps = {
  adminServerUrl: string;
  id: string;
  topicName?: string;
}

const KafkaPageContent: React.FunctionComponent<KafkaPageContentProps> = ({ adminServerUrl, id, topicName }) => {
  const { getToken } = useContext(AuthContext);
  const history = useHistory();
  const [showCreate, setShowCreate] = useState<boolean>(false);
  const [showUpdate, setShowUpdate] = useState<boolean>(false);
  const [error, setError] = useState<undefined | number>();
  const dispatch = useDispatch();

  const onCreateTopic = () => {
    setShowCreate(true);
  }

  const onClickTopic = (topicName) => {
    history.push(`/streams/kafkas/${id}/topics/${topicName}`);
  }

  const onCloseCreateTopic = () => {
    setShowCreate(false);
  }

  const getTopicDetailsPath = (topicName: string | undefined) => {
    if (topicName === undefined) {
      return history.createHref({ pathname: `streams/kafkas/${id}` });
    }
    return history.createHref({ pathname: `/streams/kafkas/${id}/topics/${topicName}`, key: topicName });
  };

  const onUpdateTopic = () => {
    setShowUpdate(true);
  }

  const onError = (code: number, message: string) => {
    setError(code);
  }

  const onDeleteTopic = () => {
    history.push(`/streams/kafkas/${id}`);
  }

  const addAlert = (message: string, variant?: AlertVariant) => {
    dispatch(
      addNotification({
        variant: variant,
        title: message
      })
    );

  };

  let topicModule = KafkaUITopicModules.topicListModule;
  if (showCreate) {
    topicModule = KafkaUITopicModules.topicCreateModule
  } else if (topicName && showUpdate) {
    topicModule = KafkaUITopicModules.topicUpdateModule
  } else if (topicName) {
    topicModule = KafkaUITopicModules.topicListDetailModule
  }


  let kafkaUITopicPage = <FederatedModule
    data-ouia-app-id="dataPlane-streams"
    scope="kafka"
    module={topicModule}
    render={(FederatedTopics) => <FederatedTopics
      getToken={getToken}
      apiBasePath={adminServerUrl}
      onCreateTopic={onCreateTopic}
      onClickTopic={onClickTopic}
      getTopicDetailsPath={getTopicDetailsPath}
      onCloseCreateTopic={onCloseCreateTopic}
      onUpdateTopic={onUpdateTopic}
      currentTopic={topicName}
      addAlert={addAlert}
      onDeleteTopic={onDeleteTopic}
      onError={onError}
    />}
  />
  
  if (error === 401) {
    kafkaUITopicPage = <DevelopmentPreview> <AccessDeniedPage/> </DevelopmentPreview>;
  }
  return (<div className='app-services-ui--u-display-contents' data-ouia-app-id="dataPlane-streams"> <DevelopmentPreview> {kafkaUITopicPage} </DevelopmentPreview> </div>)
}
