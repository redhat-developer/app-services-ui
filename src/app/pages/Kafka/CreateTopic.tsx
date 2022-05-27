import {
  KafkaFederatedComponent,
  UnderlyingProps,
} from "@app/pages/Kafka/KafkaFederatedComponent";
import { FunctionComponent } from "react";

export const CreateTopic: FunctionComponent<UnderlyingProps> = (props) => (
  <KafkaFederatedComponent module="./CreateTopic" {...props} />
);
