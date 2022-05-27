import {
  KafkaFederatedComponent,
  UnderlyingProps,
} from "@app/pages/Kafka/KafkaFederatedComponent";
import { FunctionComponent } from "react";

export const ConsumerGroups: FunctionComponent<UnderlyingProps> = (props) => (
  <KafkaFederatedComponent module="./ConsumerGroups" {...props} />
);
