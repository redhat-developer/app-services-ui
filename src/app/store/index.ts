import ReducerRegistry from "@redhat-cloud-services/frontend-components-utilities/ReducerRegistry/ReducerRegistry";
import promiseMiddleware from "redux-promise-middleware";
import { notificationsReducer } from "@redhat-cloud-services/frontend-components-notifications/redux";

let registry: ReducerRegistry;

export function init(...middleware: any) {
  if (!registry) {
    registry = new ReducerRegistry({}, [promiseMiddleware, ...middleware]);

    //If you want to register all of your reducers, this is good place.

    registry.register({
      notifications: notificationsReducer,
    });
  }

  return registry;
}
