import React, { useEffect, useState } from 'react';
import { Configuration, DefaultApi } from "../../../openapi/kas";
import { useHistory } from "react-router-dom";
import { getParams } from "@app/pages/Kafka/utils";
import getBaseName from '@app/utils/getBaseName';
import { useAlert, useAuth, useConfig } from '@bf2/ui-shared';
import { Loading } from "@app/components/Loading/Loading";
import { FederatedModule } from "@app/components/FederatedModule/FederatedModule";
import { DevelopmentPreview } from "@app/components/DevelopmentPreview/DevelopmentPreview";
import { AccessDeniedPage, ServiceDownPage } from "@app/pages";

enum KafkaUIKafkaModules {
  kafkaMainPageModule = "./Panels/KafkaMainView",
  topicListDetailModule = "./Panels/TopicDetails",
  topicCreateModule = "./Panels/CreateTopic",
  topicUpdateModule = "./Panels/UpdateTopic"
}

export const KafkaPage: React.FunctionComponent = () => {
  const config = useConfig();

  if (config?.serviceDown) {
    return (<ServiceDownPage/>);
  }

  return (<KafkaPageConnected/>);
}

const KafkaPageConnected: React.FunctionComponent = () => {
  const config = useConfig();
  const auth = useAuth();
  const [adminServerUrl, setAdminServerUrl] = useState<undefined | string>();

  const { id, topicName } = getParams();
  const [kafkaName, setKafkaName] = useState<undefined | string>();
  useEffect(() => {
    const getAdminApiUrl = async () => {
      const accessToken = await auth?.kas.getToken();
      const apisService = new DefaultApi({
        accessToken,
        basePath: config?.kas.apiBasePath || '',
      } as Configuration);

      const kafka = await apisService.getKafkaById(id);
      setKafkaName(kafka.data.name);
      setAdminServerUrl(`https://admin-server-${kafka.data.bootstrapServerHost}/rest`);
    }

    getAdminApiUrl();
  }, [auth, config, id]);

  if (config === undefined || adminServerUrl === undefined) {
    return <Loading/>
  }

  return <KafkaPageContent adminServerUrl={adminServerUrl} id={id} topicName={topicName} kafkaName={kafkaName}/>

}

type KafkaPageContentProps = {
  adminServerUrl: string;
  id: string;
  topicName?: string;
  kafkaName?: string;
}

const KafkaPageContent: React.FunctionComponent<KafkaPageContentProps> = ({
                                                                            adminServerUrl,
                                                                            id,
                                                                            topicName,
                                                                            kafkaName
                                                                          }) => {
  const auth = useAuth();
  const alert = useAlert();
  const history = useHistory();
  const [showCreate, setShowCreate] = useState<boolean>(false);
  const [showUpdate, setShowUpdate] = useState<boolean>(false);
  const [error, setError] = useState<undefined | number>();

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

  const onCancelUpdateTopic = () => {
    setShowUpdate(false);
  }

  const onSaveTopic = () => {
    setShowUpdate(false);
  }


  let kafkaModule = KafkaUIKafkaModules.kafkaMainPageModule;
  if (showCreate) {
    kafkaModule = KafkaUIKafkaModules.topicCreateModule
  } else if (topicName && showUpdate) {
    kafkaModule = KafkaUIKafkaModules.topicUpdateModule
  } else if (topicName) {
    kafkaModule = KafkaUIKafkaModules.topicListDetailModule
  }

  const kafkaPageLink = `${getBaseName(window.location.pathname)}/streams/kafkas/`;
  const kafkaInstanceLink = `${getBaseName(window.location.pathname)}/streams/kafkas/${id}`;

  let kafkaUIPage = <FederatedModule
    data-ouia-app-id="dataPlane-streams"
    scope="kafka"
    module={kafkaModule}
    render={(FederatedTopics) => <FederatedTopics
      getToken={auth?.kafka.getToken}
      apiBasePath={adminServerUrl}
      kafkaName={kafkaName}
      kafkaPageLink={kafkaPageLink}
      kafkaInstanceLink={kafkaInstanceLink}
      onCreateTopic={onCreateTopic}
      onClickTopic={onClickTopic}
      getTopicDetailsPath={getTopicDetailsPath}
      onCloseCreateTopic={onCloseCreateTopic}
      onUpdateTopic={onUpdateTopic}
      currentTopic={topicName}
      addAlert={alert?.addAlert}
      onDeleteTopic={onDeleteTopic}
      onCancelUpdateTopic={onCancelUpdateTopic}
      onSaveTopic={onSaveTopic}
      onError={onError}
    />}
  />

  if (error === 401) {
    kafkaUIPage = <AccessDeniedPage/>;
  }
  return (<div className='app-services-ui--u-display-contents' data-ouia-app-id="dataPlane-streams">
    <DevelopmentPreview> {kafkaUIPage} </DevelopmentPreview></div>)
}
