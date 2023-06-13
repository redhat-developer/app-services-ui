import {
  FunctionComponent,
  lazy,
  useCallback,
  VoidFunctionComponent,
  Suspense,
} from "react";
import {
  Redirect,
  Route,
  RouteComponentProps,
  Switch,
  useHistory,
} from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import {
  DevelopmentPreview,
  AppServicesPageNotFound,
  AppServicesEmptyState,
  AppServicesEmptyStateVariant,
} from "@rhoas/app-services-ui-components";
import {
  AppRouteConfig,
  flattenedRoutes,
  IAppRoute,
  PageNotFoundRoute,
} from "@app/utils/Routing";
import { useDocumentTitle } from "@app/utils";
import { KafkaMainView } from "@app/pages/Kafka";
import { BasenameContext } from "@rhoas/app-services-ui-shared";
import { AppServicesLoading } from "@rhoas/app-services-ui-components";
import { useTranslation } from "react-i18next";
import { Button } from "@patternfly/react-core";

const QuickStartLoaderFederated = lazy(
  () => import("@app/pages/Resources/QuickStartLoaderFederated")
);

const APIManagementPage = lazy(
  () => import("@app/pages/APIManagement/APIManagementPage")
);

const DataSciencePage = lazy(
  () => import("@app/pages/DataScience/DataSciencePage")
);

const KasPage = lazy(() => import("@app/pages/Kas/KasPage"));
const OverviewPage = lazy(() => import("@app/pages/Overview/OverviewPage"));
const ResourcesPage = lazy(() => import("@app/pages/Resources/ResourcesPage"));
const ServiceAccountsPage = lazy(
  () => import("@app/pages/ServiceAccounts/ServiceAccountsPage")
);

const RedirectToOverview: FunctionComponent = () => <Redirect to="/overview" />;
const RedirectToStreamsKafkas: FunctionComponent = () => (
  <Redirect to="/streams/kafkas" />
);
const RedirectToServiceAccounts: FunctionComponent = () => (
  <Redirect to="/service-accounts" />
);
const RedirectToResources: FunctionComponent = () => (
  <Redirect to="/learning-resources" />
);

const appRoutes: AppRouteConfig<unknown>[] = [
  {
    component: RedirectToOverview,
    exact: true,
    label: "Overview",
    path: "/",
    title: "Overview | Red Hat OpenShift Application Services",
  },
  {
    component: OverviewPage,
    exact: true,
    label: "Overview",
    path: "/overview",
    title: "Overview | Red Hat OpenShift Application Services",
  },
  {
    component: APIManagementPage,
    exact: true,
    label: "API Management",
    path: "/api-management",
    title: "API Management | Red Hat OpenShift Application Services",
  },
  {
    component: DataSciencePage,
    exact: true,
    label: "Data Science",
    path: "/data-science",
    title: "Data Science | Red Hat OpenShift Application Services",
  },
  {
    component: ResourcesPage,
    exact: true,
    label: "Learning Resources | Red Hat OpenShift Application Services",
    path: "/learning-resources",
    title: "Learning Resources | Red Hat OpenShift Application Services",
    devPreview: false,
  },
  /**
   * STREAMS SECTION
   */
  {
    // Handle the redirect from application-services/streams to application-services/streams/kafkas
    component: RedirectToStreamsKafkas,
    exact: true,
    label: "Streams for Apache Kafka",
    path: "/streams",
    title: "Streams for Apache Kafka | Red Hat OpenShift Application Services",
  },
  // {
  //   component: KafkaOverviewPage,
  //   exact: true,
  //   label: "Streams for Apache Kafka",
  //   path: "/streams/overview",
  //   title:
  //     "Overview | Streams for Apache Kafka | Red Hat OpenShift Application Services",
  // },
  {
    component: KasPage,
    exact: true,
    label: "Streams for Apache Kafka",
    path: "/streams/kafkas",
    title: "Streams for Apache Kafka | Red Hat OpenShift Application Services",
    basename: "/streams/kafkas",
    devPreview: false,
  },
  {
    component: RedirectToServiceAccounts,
    exact: true,
    label: "Service Accounts",
    path: "/streams/service-accounts",
    title: "Service Accounts | Red Hat OpenShift Application Services",
    devPreview: false,
  },
  {
    // Handle the redirect for the old url application-services/streams/resources to application-services/learning-resources
    component: RedirectToResources,
    label: "QuickStarts for Red Hat OpenShift Application Services",
    path: "/streams/resources",
    title: "QuickStarts for Red Hat OpenShift Application Services",
    devPreview: true,
  },
  // this needs to be the last route for the streams section since it's the catch-all one
  {
    component: KafkaMainView,
    label: "Streams for Apache Kafka",
    path: "/streams/kafkas/:id",
    title: "Streams for Apache Kafka | Red Hat OpenShift Application Services",
    basename: "/streams/kafkas/:id",
    devPreview: false,
  },
  /**
   * END OF STREAMS SECTION
   */
  {
    component: ServiceAccountsPage,
    exact: true,
    label: "Service Accounts",
    path: "/service-accounts",
    title: "Service Accounts | Red Hat OpenShift Application Services",
    devPreview: false,
  },

  // old url handling
  {
    component: RedirectToStreamsKafkas,
    // Handle the redirect for the old url application-services/openshift-streams to application-services/streams/kafkas
    exact: true,
    label: "Streams for Apache Kafka",
    path: "/openshift-streams",
    title: "Streams for Apache Kafka | Red Hat OpenShift Application Services",
  },
];

const WrappedRoute: FunctionComponent<IAppRoute<unknown>> = ({
  component: Component,
  title,
  basename,
  devPreview,
  ...rest
}) => {
  const { t } = useTranslation();
  const history = useHistory();
  useDocumentTitle(title);
  const getBasename = useCallback(() => {
    return basename || "";
  }, [basename]);
  const onClickButton = useCallback(() => history.push("/"), [history]);

  const wrapRoute = useCallback(
    (routeProps: RouteComponentProps) => {
      return (
        <ErrorBoundary
          fallbackRender={({ error }) =>
            error.message === "404" ? (
              <AppServicesPageNotFound />
            ) : (
              <AppServicesEmptyState
                emptyStateProps={{
                  variant: AppServicesEmptyStateVariant.UnexpectedError,
                }}
                emptyStateIconProps={{
                  className: "icon-color",
                }}
                titleProps={{
                  title: t("common:something_went_wrong"),
                }}
                emptyStateBodyProps={{
                  body: t("common:unexpected_error"),
                }}
              >
                <Button onClick={onClickButton}>
                  {t("common:return_to_home_page")}
                </Button>
              </AppServicesEmptyState>
            )
          }
        >
          <DevelopmentPreview show={devPreview}>
            <BasenameContext.Provider value={{ getBasename }}>
              <Component {...rest} {...routeProps} />
            </BasenameContext.Provider>
          </DevelopmentPreview>
        </ErrorBoundary>
      );
    },
    [Component, devPreview, getBasename, onClickButton, rest, t]
  );

  return <Route render={wrapRoute} {...rest} />;
};

const AppRoutes: VoidFunctionComponent = () => {
  return (
    <>
      <Suspense fallback={<AppServicesLoading />}>
        <Switch>
          {flattenedRoutes(appRoutes).map(
            ({ path, exact, component, title, isAsync, ...rest }, idx) => (
              <WrappedRoute
                path={path}
                exact={exact}
                component={component}
                key={idx}
                title={title}
                isAsync={isAsync}
                {...rest}
              />
            )
          )}
          <PageNotFoundRoute title="404 Page Not Found" />
        </Switch>
      </Suspense>
      <QuickStartLoaderFederated />
    </>
  );
};

export { AppRoutes, appRoutes };
