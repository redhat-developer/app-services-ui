import { useCallback, useMemo, useState, VoidFunctionComponent } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  AccessDeniedPage,
  ConnectedMetrics,
  ServiceDownPage,
} from "@app/pages";
import {
  KafkaInstance,
  useKafkaInstance,
} from "@app/pages/Kafka/kafka-instance";
import { UnderlyingProps } from "@app/pages/Kafka/KafkaFederatedComponent";
import { PrincipalsProvider } from "@app/components/PrincipalsProvider/PrincipalsProvider";
import { useAuth, useConfig } from "@rhoas/app-services-ui-shared";
import { AppServicesLoading } from "@rhoas/app-services-ui-components";
import { ServiceRegistrySchemaMapping } from "@app/pages/ServiceRegistry";
import { KafkaRoutes } from "./KafkaRoutes";
import { FederatedModule } from "@app/components";

export const KafkaMainView: VoidFunctionComponent = () => {
  const config = useConfig();
  const { id: kafkaInstanceId } = useParams<{ id: string }>();
  const kafka = useKafkaInstance(kafkaInstanceId);

  if (config?.serviceDown) {
    return <ServiceDownPage />;
  }

  if (kafka === undefined) {
    return <AppServicesLoading />;
  }

  if (kafka === false) {
    throw new Error("404");
  }

  return <KafkaMainViewConnected kafka={kafka} />;
};

export const KafkaMainViewConnected: VoidFunctionComponent<{
  kafka: KafkaInstance;
}> = ({ kafka }) => {
  return (
    <PrincipalsProvider kafkaInstance={kafka.kafkaDetail}>
      <ConnectedKafkaRoutes kafka={kafka} />
    </PrincipalsProvider>
  );
};

const ConnectedKafkaRoutes: VoidFunctionComponent<{
  kafka: KafkaInstance;
}> = ({ kafka: { kafkaDetail, adminServerUrl } }) => {
  const {
    kafka: { getToken },
  } = useAuth();
  const history = useHistory();
  const [error, setError] = useState<undefined | number>();

  const onError = useCallback((code: number) => {
    setError(code);
  }, []);

  const redirectAfterDeleteInstance = useCallback(() => {
    history.push("/streams/kafkas");
  }, [history]);

  const showMetrics = useMemo(
    () => (
      <ConnectedMetrics
        kafkaId={kafkaDetail.id}
        kafkaAdminUrl={adminServerUrl}
        totalMaxConnections={kafkaDetail.size.total_max_connections || 0}
        maxConnections={kafkaDetail.size.max_connection_attempts_per_sec || 0}
        maxPartitions={kafkaDetail.size.max_partitions || 0}
        kafkaStorageBytes={
          kafkaDetail.max_data_retention_size?.bytes || 0
        }
      />
    ),
    [adminServerUrl, kafkaDetail]
  );
  const showSchemas = useMemo(() => <ServiceRegistrySchemaMapping />, []);

  const props = useMemo<Partial<UnderlyingProps>>(
    () => ({
      kafkaPageLink: "/streams/kafkas",
      kafkaInstanceLink: `/streams/kafkas/${kafkaDetail.id}/topics`,
      showMetrics,
      onError,
      kafkaName: kafkaDetail.name,
      apiBasePath: adminServerUrl,
      getToken: getToken,
      showSchemas,
      kafka: kafkaDetail,
      redirectAfterDeleteInstance,
    }),
    [
      adminServerUrl,
      getToken,
      kafkaDetail,
      onError,
      redirectAfterDeleteInstance,
      showMetrics,
      showSchemas,
    ]
  );

  if (error === 401) {
    return <AccessDeniedPage />;
  }

  return (
    <FederatedModule
      scope="kas"
      module="./InstanceDrawer"
      fallback={null}
      render={(InstanceDrawer) => (
        <KafkaRoutes {...props} InstanceDrawer={InstanceDrawer} />
      )}
    />
  );
};
