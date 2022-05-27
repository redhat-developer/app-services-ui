import { FunctionComponent } from "react";
import {
  KafkaFederatedComponent,
  UnderlyingProps,
} from "@app/pages/Kafka/KafkaFederatedComponent";

export const UpdateTopic: FunctionComponent<UnderlyingProps> = (props) => (
  <KafkaFederatedComponent module="./UpdateTopic" {...props} />
);
