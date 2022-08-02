import {
  LazyExoticComponent,
  useState,
  VoidFunctionComponent,
  useCallback,
} from "react";
import { useTranslation } from "react-i18next";
import {
  ProductType,
  QuotaContext,
  useConfig,
} from "@rhoas/app-services-ui-shared";
import { ServiceDownPage } from "@app/pages/ServiceDown/ServiceDownPage";
import {
  FederatedModule,
  usePrincipal,
  useKafkaInstanceDrawer,
} from "@app/components";
import { useModalControl, useQuota } from "@app/hooks";
import {
  AppServicesLoading,
  TermsAndConditionModal,
} from "@rhoas/app-services-ui-components";
import { ITermsConfig } from "@app/services";
import { useConstants } from "@app/providers/config/ServiceConstants";
import { useKafkaInstance } from "@app/pages/Kafka/kafka-instance";

const KasPage: VoidFunctionComponent = () => {
  const { getQuota } = useQuota(ProductType?.kas);

  return (
    <QuotaContext.Provider value={{ getQuota }}>
      <FederatedModule
        scope="kas"
        module="./OpenshiftStreams"
        fallback={<AppServicesLoading />}
        render={(component) => <KasPageConnected Component={component} />}
      />
    </QuotaContext.Provider>
  );
};

const KasPageConnected: VoidFunctionComponent<{
  Component: LazyExoticComponent<any>;
}> = ({ Component }) => {
  const config = useConfig();
  const constants = useConstants();
  const { t } = useTranslation();

  const { preCreateInstance, shouldOpenCreateModal } = useModalControl({
    eventCode: constants.kafka.ams.termsAndConditionsEventCode,
    siteCode: constants.kafka.ams.termsAndConditionsSiteCode,
  } as ITermsConfig);
  const { getAllUserAccounts } = usePrincipal();

  const [drawerInstanceId, setDrawerInstanceId] = useState<string | undefined>(
    undefined
  );
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [url, setUrl] = useState<string>("");

  const drawerInstance = useKafkaInstance(drawerInstanceId);
  const drawerInstanceDetails = drawerInstance
    ? drawerInstance.kafkaDetail
    : undefined;

  const drawerProps = useKafkaInstanceDrawer();

  const handlePreCreateInstance = useCallback(
    async (open: boolean) => {
      const { shouldOpenCreateModal, url } = await preCreateInstance(open);
      if (shouldOpenCreateModal === false && url) {
        setIsOpenModal(true);
        setUrl(url);
        return false;
      }
      return true;
    },
    [preCreateInstance, setIsOpenModal, setUrl]
  );

  const onClsoeModal = () => {
    setIsOpenModal(false);
  };

  const onClickViewTermsConditions = useCallback(async () => {
    window.location.href = url;
  }, [url]);

  if (config.serviceDown) {
    return <ServiceDownPage />;
  }

  return (
    <>
      <TermsAndConditionModal
        isModalOpen={isOpenModal}
        serviceName={t("common:kafka")}
        onClickViewTermsConditions={onClickViewTermsConditions}
        onCancel={onClsoeModal}
      />
      <Component
        preCreateInstance={handlePreCreateInstance}
        shouldOpenCreateModal={shouldOpenCreateModal}
        drawerInstance={drawerInstanceDetails}
        setDrawerInstance={setDrawerInstanceId}
        {...drawerProps}
        getAllUserAccounts={getAllUserAccounts}
      />
    </>
  );
};

export default KasPage;
