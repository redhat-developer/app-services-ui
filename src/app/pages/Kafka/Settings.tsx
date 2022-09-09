import {
  KafkaFederatedComponent,
  UnderlyingProps,
} from "@app/pages/Kafka/KafkaFederatedComponent";
import { FunctionComponent } from "react";

export const Settings: FunctionComponent<UnderlyingProps> = (props) => (
  <KafkaFederatedComponent module="./Settings" {...props} />
);
