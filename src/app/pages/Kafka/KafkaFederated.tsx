import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Configuration, DefaultApi, KafkaRequest } from '@rhoas/kafka-management-sdk';
import getBaseName from '@app/utils/getBaseName';
import { useAlert, useAuth, useConfig } from '@bf2/ui-shared';
import { Loading, FederatedModule, DevelopmentPreview, InstanceDrawer } from '@app/components';
import { AccessDeniedPage, ServiceDownPage } from '@app/pages';

type KafkaFederatedProps = {
  module: string;
};

export const KafkaFederated: React.FunctionComponent<KafkaFederatedProps> = ({ module }) => {
  const config = useConfig();

  if (config?.serviceDown) {
    return <ServiceDownPage />;
  }

  return <KafkaPageConnected module={module} />;
};

const KafkaPageConnected: React.FunctionComponent<KafkaFederatedProps> = ({ module }) => {
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
      setAdminServerUrl(`https://admin-server-${kafka.data.bootstrapServerHost}/rest`);
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
      module={module}
    />
  );
};

type KafkaPageContentProps = {
  adminServerUrl: string;
  id: string;
  topicName?: string;
  kafkaName?: string;
  kafkaDetail: KafkaRequest | undefined;
  module: string;
};

const KafkaPageContent: React.FunctionComponent<KafkaPageContentProps> = ({
  adminServerUrl,
  id,
  topicName,
  kafkaName,
  kafkaDetail,
  module,
}) => {
  const auth = useAuth();
  const alert = useAlert();

  const [error, setError] = useState<undefined | number>();
  const [isInstanceDrawerOpen, setIsInstanceDrawerOpen] = useState<boolean | undefined>();
  const [activeDrawerTab, setActiveDrawerTab] = useState<string>('');
  const [isOpenDeleteInstanceModal, setIsOpenDeleteInstanceModal] = useState<boolean>(false);
  const [currentTopic, setCurrentTopic] = useState(topicName);

  const onError = (code: number) => {
    setError(code);
  };

  const kafkaPageLink = `${getBaseName(window.location.pathname)}/streams/kafkas/`;
  const kafkaInstanceLink = `${getBaseName(window.location.pathname)}/streams/kafkas/${id}`;

  const handleInstanceDrawer = (isOpen: boolean, activeTab?: string) => {
    activeTab && setActiveDrawerTab(activeTab);
    setIsInstanceDrawerOpen(isOpen);
  };

  const onCloseInstanceDrawer = () => {
    setIsInstanceDrawerOpen(false);
  };

  let kafkaUIPage = (
    <FederatedModule
      data-ouia-app-id="dataPlane-streams"
      scope="kafka"
      module={module}
      render={(FederatedKafka) => (
        <FederatedKafka
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
