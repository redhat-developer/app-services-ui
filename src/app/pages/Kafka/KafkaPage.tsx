import React, { useEffect, useState } from 'react';
import { Configuration, DefaultApi, KafkaRequest } from '@rhoas/kafka-management-sdk';
import { useHistory, useParams } from 'react-router-dom';
import getBaseName from '@app/utils/getBaseName';
import { useAlert, useAuth, useConfig } from '@bf2/ui-shared';
import { Loading, FederatedModule, DevelopmentPreview, InstanceDrawer, Metrics } from '@app/components';
import { AccessDeniedPage, ServiceDownPage } from '@app/pages';

enum KafkaActionsModules {
  ViewTopics = './Panels/KafkaMainView',
  DetailsTopic = './Panels/TopicDetails',
  CreateTopic = './Panels/CreateTopic',
  UpdateTopic = './Panels/UpdateTopic',
}

export enum KafkaActions {
  ViewTopics = 'ViewTopics',
  CreateTopic = 'CreateTopic',
  DetailsTopic = 'DetailsTopic',
  UpdateTopic = 'UpdateTopic',
}

export const KafkaPage: React.FunctionComponent = () => {
  const config = useConfig();

  if (config?.serviceDown) {
    return <ServiceDownPage />;
  }

  return <KafkaPageConnected />;
};

const KafkaPageConnected: React.FunctionComponent = () => {
  const config = useConfig();
  const auth = useAuth();
  const [adminServerUrl, setAdminServerUrl] = useState<undefined | string>();
  const [kafkaDetail, setKafkaDetail] = useState<KafkaRequest | undefined>();

  const { id, topicName } = useParams<{ id: string; topicName: string }>();
  const [kafkaName, setKafkaName] = useState<undefined | string>();

  useEffect(() => {
    const getAdminApiUrl = async () => {
      const accessToken = await auth?.kas.getToken();
      const apisService = new DefaultApi({
        accessToken,
        basePath: config?.kas.apiBasePath || '',
      } as Configuration);

      const kafka = await apisService.getKafkaById(id);
      setKafkaDetail(kafka.data);
      setKafkaName(kafka.data.name);
      setAdminServerUrl(`https://admin-server-${kafka.data.bootstrap_server_host}/rest`);
    };

    getAdminApiUrl();
  }, [auth, config, id]);

  if (config === undefined || adminServerUrl === undefined) {
    return <Loading />;
  }

  return (
    <KafkaPageContent
      adminServerUrl={adminServerUrl}
      id={id}
      topicName={topicName}
      kafkaName={kafkaName}
      kafkaDetail={kafkaDetail}
    />
  );
};

type KafkaPageContentProps = {
  adminServerUrl: string;
  id: string;
  topicName?: string;
  kafkaName?: string;
  kafkaDetail: KafkaRequest | undefined;
};

const KafkaPageContent: React.FunctionComponent<KafkaPageContentProps> = ({
  adminServerUrl,
  id,
  topicName,
  kafkaName,
  kafkaDetail,
}) => {
  const auth = useAuth();
  const alert = useAlert();
  const history = useHistory();

  const [error, setError] = useState<undefined | number>();
  const [isInstanceDrawerOpen, setIsInstanceDrawerOpen] = useState<boolean | undefined>();
  const [activeDrawerTab, setActiveDrawerTab] = useState<string>('');
  const [isOpenDeleteInstanceModal, setIsOpenDeleteInstanceModal] = useState<boolean>(false);
  const [activeAction, setActiveAction] = useState();
  const [currentTopic, setCurrentTopic] = useState(topicName);
  const [kafkaModule, setKafkaModule] = useState<KafkaActionsModules>(KafkaActionsModules.ViewTopics);

  const onError = (code: number) => {
    setError(code);
  };

  const onConnectToRoute = (routePath: string) => {
    if (routePath) {
      history.push(`/streams/kafkas/${id}/${routePath}`);
    } else {
      history.push(`/streams/kafkas/${id}`);
    }
  };

  const getConnectToRoutePath = (routePath: string, topicName?: string) => {
    if (routePath === undefined) {
      throw new Error('Route path is missing');
    }
    if (topicName) {
      return history.createHref({ pathname: `/streams/kafkas/${id}/${routePath}`, key: topicName });
    }
    return history.createHref({ pathname: `/streams/kafkas/${id}/${routePath}` });
  };

  if (topicName && !activeAction) {
    setKafkaModule(KafkaActionsModules.DetailsTopic);
  } else if (activeAction) {
    setKafkaModule(KafkaActionsModules[activeAction]);
  } else {
    setKafkaModule(KafkaActionsModules.ViewTopics);
  }

  const kafkaPageLink = `${getBaseName(window.location.pathname)}/streams/kafkas/`;
  const kafkaInstanceLink = `${getBaseName(window.location.pathname)}/streams/kafkas/${id}`;

  const handleInstanceDrawer = (isOpen: boolean, activeTab?: string) => {
    activeTab && setActiveDrawerTab(activeTab);
    setIsInstanceDrawerOpen(isOpen);
  };

  const onCloseInstanceDrawer = () => {
    setIsInstanceDrawerOpen(false);
  };

  const dispatchKafkaAction = (kafkaAction: KafkaActions, topic: string | undefined) => {
    if (topic) {
      setCurrentTopic(topic);
    }
    setActiveAction(kafkaAction);
  };

  const onCreateTopic = () => {
    setKafkaModule(KafkaActionsModules.CreateTopic);
  };

  const showMetrics = () => {
    if (kafkaModule === KafkaActionsModules.ViewTopics) {
      return <Metrics kafkaId={id} onCreateTopic={onCreateTopic} />;
    }
    return <></>;
  };

  let kafkaUIPage = (
    <FederatedModule
      data-ouia-app-id="dataPlane-streams"
      scope="kafka"
      module={kafkaModule}
      fallback={<Loading />}
      render={(FederatedTopics) => (
        <FederatedTopics
          getToken={auth?.kafka.getToken}
          apiBasePath={adminServerUrl}
          kafkaName={kafkaName}
          kafkaPageLink={kafkaPageLink}
          kafkaInstanceLink={kafkaInstanceLink}
          topicName={currentTopic}
          addAlert={alert?.addAlert}
          onError={onError}
          handleInstanceDrawer={handleInstanceDrawer}
          setIsOpenDeleteInstanceModal={setIsOpenDeleteInstanceModal}
          dispatchKafkaAction={dispatchKafkaAction}
          onConnectToRoute={onConnectToRoute}
          getConnectToRoutePath={getConnectToRoutePath}
          showMetrics={showMetrics()}
        />
      )}
    />
  );

  if (error === 401) {
    kafkaUIPage = <AccessDeniedPage />;
  }
  return (
    <div className="app-services-ui--u-display-contents" data-ouia-app-id="dataPlane-streams">
      <DevelopmentPreview>
        <InstanceDrawer
          isExpanded={isInstanceDrawerOpen}
          onClose={onCloseInstanceDrawer}
          kafkaDetail={kafkaDetail}
          activeTab={activeDrawerTab}
          isOpenDeleteInstanceModal={isOpenDeleteInstanceModal}
          setIsOpenDeleteInstanceModal={setIsOpenDeleteInstanceModal}
        >
          {kafkaUIPage}
        </InstanceDrawer>
      </DevelopmentPreview>
    </div>
  );
};

export default KafkaPage;
