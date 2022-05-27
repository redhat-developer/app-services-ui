import {
  KafkaFederatedComponent,
  UnderlyingProps,
} from "@app/pages/Kafka/KafkaFederatedComponent";
import { FunctionComponent } from "react";

export const TopicDetails: FunctionComponent<UnderlyingProps> = (props) => (
  <KafkaFederatedComponent module="./TopicDetails" {...props} />
);
