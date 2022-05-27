import { LazyExoticComponent, useState, VoidFunctionComponent } from "react";
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
import { AppServicesLoading } from "@rhoas/app-services-ui-components";
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
  const { preCreateInstance, shouldOpenCreateModal } = useModalControl({
    eventCode: constants.kafka.ams.termsAndConditionsEventCode,
    siteCode: constants.kafka.ams.termsAndConditionsSiteCode,
  } as ITermsConfig);
  const { getAllUserAccounts } = usePrincipal();

  const [drawerInstanceId, setDrawerInstanceId] = useState<string | undefined>(
    undefined
  );
  const drawerInstance = useKafkaInstance(drawerInstanceId);
  const drawerInstanceDetails = drawerInstance
    ? drawerInstance.kafkaDetail
    : undefined;

  const drawerProps = useKafkaInstanceDrawer();

  if (config.serviceDown) {
    return <ServiceDownPage />;
  }

  return (
    <Component
      preCreateInstance={preCreateInstance}
      shouldOpenCreateModal={shouldOpenCreateModal}
      drawerInstance={drawerInstanceDetails}
      setDrawerInstance={setDrawerInstanceId}
      {...drawerProps}
      getAllUserAccounts={getAllUserAccounts}
    />
  );
};

export default KasPage;
