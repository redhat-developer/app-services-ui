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
import { useQuota, withTermsAndConditions, ServiceType } from "@app/hooks";
import { AppServicesLoading } from "@rhoas/app-services-ui-components";
import { useKafkaInstance } from "@app/pages/Kafka/kafka-instance";

type KasPageProps = {
  preCreateInstance: (open: boolean) => Promise<boolean>;
  shouldOpenCreateModal: () => Promise<boolean>;
};

const KasPage: VoidFunctionComponent<any> = ({
  preCreateInstance,
  shouldOpenCreateModal,
}) => {
  const { getQuota } = useQuota(ProductType?.kas);

  return (
    <QuotaContext.Provider value={{ getQuota }}>
      <FederatedModule
        scope="kas"
        module="./OpenshiftStreams"
        fallback={<AppServicesLoading />}
        render={(component) => (
          <KasPageConnected
            Component={component}
            shouldOpenCreateModal={shouldOpenCreateModal}
            preCreateInstance={preCreateInstance}
          />
        )}
      />
    </QuotaContext.Provider>
  );
};

type KasPageConnectedzProps = KasPageProps & {
  Component: LazyExoticComponent<any>;
};

const KasPageConnected: VoidFunctionComponent<KasPageConnectedzProps> = ({
  Component,
  preCreateInstance,
  shouldOpenCreateModal,
}) => {
  const config = useConfig();
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

export default withTermsAndConditions(KasPage, ServiceType.KAFKA);
