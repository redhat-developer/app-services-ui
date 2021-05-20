import React, { useContext } from 'react';
import { useHistory } from 'react-router';
import { InsightsContext } from '@app/utils/insights';
import { useDispatch } from 'react-redux';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/';
import { AlertVariant } from '@patternfly/react-core';
import { FederatedModule } from '../FederatedModule/FederatedModule';
import { ConfigContext } from '@app/Config/Config';
import { Loading } from '@app/Components/Loading/Loading';
import { KafkaRequest } from '../../../openapi/kas';

type InstanceDrawerProps = {
  kafkaDetail: KafkaRequest | undefined;
  isExpanded: boolean | undefined;
  activeTab: string;
  onClose: () => void;
  isOpenDeleteInstanceModal: boolean;
  setIsOpenDeleteInstanceModal: (isopen: boolean) => void;
};

export const InstanceDrawer: React.FC<InstanceDrawerProps> = ({
  isExpanded,
  onClose,
  kafkaDetail,
  activeTab,
  children,
  setIsOpenDeleteInstanceModal,
  isOpenDeleteInstanceModal,
}) => {
  const insights = useContext(InsightsContext);
  const config = useContext(ConfigContext);
  const dispatch = useDispatch();
  const history = useHistory();

  const addAlert = (message: string, variant?: AlertVariant) => {
    dispatch(
      addNotification({
        variant: variant,
        title: message,
      })
    );
  };

  if (config === undefined) {
    return <Loading />;
  }

  const getUsername = () => insights.chrome.auth.getUser().then((user) => user.identity.user.username);

  const getConnectToRoutePath = (event: any, routePath: string) => {
    if (routePath === undefined) {
      throw new Error('Route path is missing');
    }
    return history.createHref({ pathname: `/streams/${routePath}` });
  };

  const onConnectToRoute = async (event: any, routePath: string) => {
    if (routePath === undefined) {
      throw new Error('Route path is missing');
    }
    history.push(`/streams/${routePath}`);
  };

  const { authServerUrl, realm } = config?.dataPlane?.keycloak || {};
  const tokenEndPointUrl = `${authServerUrl}/realms/${realm}/protocol/openid-connect/token`;

  return (
    <FederatedModule
      scope="kas"
      module="./InstanceDrawer"
      render={(InstanceDrawerFederated) => {
        return (
          <InstanceDrawerFederated
            getToken={insights.chrome.auth.getToken}
            getUsername={getUsername}
            addAlert={addAlert}
            basePath={config?.controlPlane.serviceApiBasePath}
            getConnectToRoutePath={getConnectToRoutePath}
            onConnectToRoute={onConnectToRoute}
            tokenEndPointUrl={tokenEndPointUrl}
            isExpanded={isExpanded}
            onClose={onClose}
            instanceDetail={kafkaDetail}
            activeTab={activeTab}
            isOpenDeleteInstanceModal={isOpenDeleteInstanceModal}
            setIsOpenDeleteInstanceModal={setIsOpenDeleteInstanceModal}
          >
            {children}
          </InstanceDrawerFederated>
        );
      }}
    />
  );
};
