import ReducerRegistry from '@redhat-cloud-services/frontend-components-utilities/files/ReducerRegistry';
import promiseMiddleware from 'redux-promise-middleware';
import { notificationsReducer } from '@redhat-cloud-services/frontend-components-notifications/redux';

let registry;

export function init(...middleware) {
  if (!registry) {
    registry = new ReducerRegistry({}, [promiseMiddleware, ...middleware]);

    //If you want to register all of your reducers, this is good place.

    registry.register({
      notifications: notificationsReducer,
    });
  }

  return registry;
}

export function getStore() {
  return registry.getStore();
}

export function register(...args) {
  return registry.register(...args);
}
