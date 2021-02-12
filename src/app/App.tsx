import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { connect, Provider } from 'react-redux';
import './App.scss';
import { getRegistry } from '@redhat-cloud-services/frontend-components-utilities/files/Registry';
import { notifications, NotificationsPortal } from '@redhat-cloud-services/frontend-components-notifications/';
import { InsightsContext } from "@app/utils/insights";
import { AppRoutes } from "@app/Routes";
import { FederatedModuleProvider } from "./Components/FederatedModule/FederatedModule";

const registry = getRegistry();
registry.register({ notifications });

export const App: React.FunctionComponent = () => {

  const insights = useContext(InsightsContext);
  const history = useHistory();

  useEffect(() => {
    insights.chrome.init();
    insights.chrome.identifyApp('application-services');


    insights.chrome.on('APP_NAVIGATION', event => {
      history.push(`/${event.navId}`);
    });
  });

  return (
    <Provider store={registry.getStore()}>
      <FederatedModuleProvider>
        <NotificationsPortal/>
        <AppRoutes/>
      </FederatedModuleProvider>
    </Provider>
  );
}

/**
 * connect: https://github.com/reactjs/react-redux/blob/master/docs/api.md
 *          https://reactjs.org/docs/higher-order-components.html
 */
export default connect()(App);
