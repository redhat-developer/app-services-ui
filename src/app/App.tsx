import { FunctionComponent, useCallback, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { NotificationsPortal } from "@redhat-cloud-services/frontend-components-notifications";
import { AppRoutes } from "@app/AppRoutes";
import { FederatedModuleProvider } from "@app/components";
import { useInsights } from "@app/hooks";
import { Page } from "@patternfly/react-core";
import "./App.css";

export const App: FunctionComponent = () => {
  const insights = useInsights();
  const history = useHistory();

  const getAppId = useCallback(() => {
    const defaultAppId = "overview";

    const parts = history.location.pathname.split("/");
    if (parts.length > 1) {
      if (parts[1] === "") {
        return defaultAppId;
      } else {
        if (parts[1] === "openshift-streams") {
          return "streams";
        }
        return parts[1];
      }
    } else {
      return defaultAppId;
    }
  }, [history]);

  useEffect(() => {
    insights.chrome.init();
    const appId = getAppId();
    insights.chrome.identifyApp(appId);
    const unregister = insights.chrome.on("APP_NAVIGATION", (event) => {
      if (event?.domEvent?.href) {
        const pathName = event?.domEvent?.href
          .replace("/application-services", "/")
          .replace(/^\/\//gm, "/");
        history.push(pathName);
      }
    });
    return () => {
      unregister();
    };
  }, [getAppId, history, insights.chrome]);

  return (
    <FederatedModuleProvider>
      <NotificationsPortal />
      <Page>
        <AppRoutes />
      </Page>
    </FederatedModuleProvider>
  );
};

/**
 * connect: https://github.com/reactjs/react-redux/blob/master/docs/api.md
 *          https://reactjs.org/docs/higher-order-components.html
 */
export default connect()(App);
