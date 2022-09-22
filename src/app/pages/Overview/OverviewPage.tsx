import { OverviewPageV4 } from "@rhoas/app-services-ui-components";
import { FunctionComponent } from "react";

export const ConnectedOverviewPage: FunctionComponent = () => {
  const kafkaHref = "/streams/kafkas";
  const serviceRegistryHref = "/service-registry";

  const connectorHref = "/connectors";

  const APIDesignHref = "/api-designer";

  return (
    <OverviewPageV4
      toKafkaHref={kafkaHref}
      toServiceRegistryHref={serviceRegistryHref}
      toConnectorsHref={connectorHref}
      toAPIDesignHref={APIDesignHref}
    />
  );
};

export default ConnectedOverviewPage;
