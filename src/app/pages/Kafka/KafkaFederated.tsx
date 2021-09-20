import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Configuration, DefaultApi, KafkaRequest, SecurityApi } from '@rhoas/kafka-management-sdk';
import getBaseName from '@app/utils/getBaseName';
import {
  Principal,
  Principals,
  PrincipalsContext,
  PrincipalType,
  useAuth,
  useConfig,
} from '@rhoas/app-services-ui-shared';
import { DevelopmentPreview, FederatedModule, InstanceDrawer, Loading } from '@app/components';
import { AccessDeniedPage, ServiceDownPage } from '@app/pages';
import { PrincipalApi } from '@redhat-cloud-services/rbac-client';

type KafkaFederatedProps = {
  module: string;
  showMetrics?: React.ReactNode;
  activeTab?: number;
};

export const KafkaFederated: React.FunctionComponent<KafkaFederatedProps> = ({ module, showMetrics, activeTab }) => {
  const config = useConfig();

  if (config?.serviceDown) {
    return <ServiceDownPage />;
  }

  return <KafkaPageConnected module={module} showMetrics={showMetrics} activeTab={activeTab} />;
};

const KafkaPageConnected: React.FunctionComponent<KafkaFederatedProps> = ({ module, showMetrics, activeTab }) => {
  const config = useConfig();
  const auth = useAuth();
  const [adminServerUrl, setAdminServerUrl] = useState<undefined | string>();
  const [kafkaDetail, setKafkaDetail] = useState<KafkaRequest | undefined>();

  const { id, topicName } = useParams<{ id: string; topicName: string }>();
  const [kafkaName, setKafkaName] = useState<undefined | string>();
  const [principals, setPrincipals] = useState<Principal[] | undefined>();

  useEffect(() => {
    const getAdminApiUrl = async () => {
      const accessToken = await auth?.kas.getToken();
      const kasService = new DefaultApi({
        accessToken,
        basePath: config?.kas.apiBasePath || '',
      } as Configuration);

      const kafka = await kasService.getKafkaById(id);
      setKafkaDetail(kafka.data);
      setKafkaName(kafka.data.name);
      setAdminServerUrl(`https://admin-server-${kafka.data.bootstrap_server_host}/rest`);
    };

    getAdminApiUrl();
  }, [auth, config, id]);

  useEffect(() => {
    const getPrincipals = async () => {
      const accessToken = await auth?.kas.getToken();
      const securityApi = new SecurityApi({
        accessToken,
        basePath: config?.kas.apiBasePath || '',
      } as Configuration);
      const serviceAccounts = await securityApi.getServiceAccounts().then((response) =>
        response.data.items.map((sa) => {
          return {
            id: sa.client_id,
            displayName: sa.name,
            principalType: PrincipalType.ServiceAccount,
          } as Principal;
        })
      );

      setPrincipals(serviceAccounts);

      const principalApi = new PrincipalApi({
        accessToken,
        basePath: config?.rbac.basePath,
      });

      const currentlyLoggedInuser = await auth?.getUsername();

      try {
        const userAccounts = await principalApi.listPrincipals(-1).then((response) =>
          response.data.data
            .map((p) => {
              return {
                id: p.username,
                principalType: PrincipalType.UserAccount,
                displayName: `${p.first_name} ${p.last_name}`,
                emailAddress: p.email,
              } as Principal;
            })
            .filter((p) => p.id !== currentlyLoggedInuser && p.id !== kafkaDetail?.owner)
        );
        setPrincipals((prevState) => prevState?.concat(userAccounts));
      } catch (e) {
        // ignore the error
      }
    };
    if (config?.rbac.basePath) {
      // Only load the principals if rbac is configured
      getPrincipals();
    }
  }, [auth, config]);

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
      showMetrics={showMetrics}
      activeTab={activeTab}
      principals={principals}
    />
  );
};

type KafkaPageContentProps = KafkaFederatedProps & {
  adminServerUrl: string;
  id: string;
  topicName?: string;
  kafkaName?: string;
  kafkaDetail: KafkaRequest | undefined;
  principals: Principal[] | undefined;
};

const KafkaPageContent: React.FunctionComponent<KafkaPageContentProps> = ({
  adminServerUrl,
  id,
  kafkaName,
  kafkaDetail,
  module,
  showMetrics,
  activeTab,
  principals,
}) => {
  const auth = useAuth();

  const [error, setError] = useState<undefined | number>();
  const [isInstanceDrawerOpen, setIsInstanceDrawerOpen] = useState<boolean | undefined>();
  const [activeDrawerTab, setActiveDrawerTab] = useState<string>('');
  const [isOpenDeleteInstanceModal, setIsOpenDeleteInstanceModal] = useState<boolean>(false);

  const onError = (code: number) => {
    setError(code);
  };

  const kafkaPageLink = `${getBaseName(window.location.pathname)}/streams/kafkas`;
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
        <PrincipalsContext.Provider
          value={
            principals
              ? ({
                  getAllPrincipals: () => principals || ([] as Principal[]),
                } as Principals)
              : undefined
          }
        >
          <FederatedKafka
            getToken={auth?.kafka.getToken}
            apiBasePath={adminServerUrl}
            kafkaName={kafkaName}
            kafkaPageLink={kafkaPageLink}
            kafkaInstanceLink={kafkaInstanceLink}
            onError={onError}
            handleInstanceDrawer={handleInstanceDrawer}
            setIsOpenDeleteInstanceModal={setIsOpenDeleteInstanceModal}
            showMetrics={showMetrics}
            activeTab={activeTab}
          />
        </PrincipalsContext.Provider>
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
