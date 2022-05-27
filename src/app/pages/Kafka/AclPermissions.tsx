import {
  KafkaFederatedComponent,
  UnderlyingProps,
} from "@app/pages/Kafka/KafkaFederatedComponent";
import { FunctionComponent } from "react";

export const AclPermissions: FunctionComponent<UnderlyingProps> = (props) => (
  <KafkaFederatedComponent module="./AclPermissions" {...props} />
);
