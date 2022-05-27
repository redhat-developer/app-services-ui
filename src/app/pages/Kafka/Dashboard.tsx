import {
  KafkaFederatedComponent,
  UnderlyingProps,
} from "@app/pages/Kafka/KafkaFederatedComponent";
import { FunctionComponent } from "react";

export const Dashboard: FunctionComponent<UnderlyingProps> = (props) => (
  <KafkaFederatedComponent module="./Dashboard" {...props} />
);
