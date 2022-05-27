import { FunctionComponent } from "react";
import {
  KafkaFederatedComponent,
  UnderlyingProps,
} from "@app/pages/Kafka/KafkaFederatedComponent";

export const Topics: FunctionComponent<UnderlyingProps> = (props) => (
  <KafkaFederatedComponent module="./Topics" {...props} />
);
