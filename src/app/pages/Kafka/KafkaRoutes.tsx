import React, { useState } from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { InstanceDrawer } from '@app/components';
import { AppRouteConfig, flattenedRoutes, IAppRoute, PageNotFoundRoute, useA11yRouteChange, } from "@app/utils/Routing";
import { useDocumentTitle } from "@app/utils";
import { AccessDeniedPage, CreateTopic, Metrics, ServiceDownPage, TopicDetails, Topics, UpdateTopic } from "@app/pages";
import { useKafkaInstance } from "@app/pages/Kafka/kafka-instance";
import { UnderlyingProps } from "@app/pages/Kafka/KafkaFederatedComponent";
import { PrincipalsProvider } from "@app/components/PrincipalsProvider/PrincipalsProvider";
import { AppServicesLoading, BasenameContext, useAuth, useConfig } from "@rhoas/app-services-ui-shared";

const kafkaRoutes: AppRouteConfig<UnderlyingProps>[] = [
  {
    component: Topics,
    exact: true,
    label: 'Red Hat OpenShift Streams for Apache Kafka',
    path: '',
    title: 'Red Hat OpenShift Streams for Apache Kafka',
    devPreview: true,
  },
  {
    component: TopicDetails,
    exact: true,
    label: 'Red Hat OpenShift Streams for Apache Kafka',
    path: '/topics/:topicName',
    title: 'Red Hat OpenShift Streams for Apache Kafka',
    devPreview: true,
  },
  {
    component: CreateTopic,
    exact: true,
    label: 'Red Hat OpenShift Streams for Apache Kafka',
    path: '/topic/create',
    title: 'Red Hat OpenShift Streams for Apache Kafka',
    devPreview: true,
  },
  {
    component: UpdateTopic,
    exact: true,
    label: 'Red Hat OpenShift Streams for Apache Kafka',
    path: '/topic/update/:topicName',
    title: 'Red Hat OpenShift Streams for Apache Kafka',
    devPreview: true,
  }
];

type WrappedRouteProps = IAppRoute<UnderlyingProps> & {
  underlyingProps: UnderlyingProps
  url: string
}

/**
 * The wrapped route allows us to apply the basename, document title and accessible route change for all components
 * without having to add these to each component. They must happen inside the route.
 */
const WrappedRoute: React.FunctionComponent<WrappedRouteProps> = ({
                                                                    component: Component,
                                                                    isAsync = false,
                                                                    title,
                                                                    devPreview,
                                                                    underlyingProps,
                                                                    url,
                                                                    ...rest
                                                                  }) => {
  useA11yRouteChange(isAsync);
  useDocumentTitle(title);

  const getBasename = () => {
    return url;
  };

  return (
    <Route
      render={
        (routeProps) => {
          return (
            <BasenameContext.Provider value={{ getBasename }}>
              <Component {...underlyingProps} {...rest} {...routeProps}  />
            </BasenameContext.Provider>
          );
        }
      }
      {...rest}
    />
  );
};

const KafkaRoutes = (): React.ReactElement => {
  const auth = useAuth();
  const history = useHistory();
  const config = useConfig();
  const { adminServerUrl, kafkaDetail } = useKafkaInstance() || {};
  const routeMatch = useRouteMatch();

  const [error, setError] = useState<undefined | number>();
  const [isInstanceDrawerOpen, setIsInstanceDrawerOpen] = useState<boolean | undefined>();
  const [activeDrawerTab, setActiveDrawerTab] = useState<string>('');
  const [isOpenDeleteInstanceModal, setIsOpenDeleteInstanceModal] = useState<boolean>(false);

  const handleInstanceDrawer = (isOpen: boolean, activeTab?: string) => {
    activeTab && setActiveDrawerTab(activeTab);
    setIsInstanceDrawerOpen(isOpen);
  };

  const onCloseInstanceDrawer = () => {
    setIsInstanceDrawerOpen(false);
  };

  if (config?.serviceDown) {
    return <ServiceDownPage/>;
  }

  if (kafkaDetail === undefined || kafkaDetail.id === undefined || adminServerUrl === undefined) {
    return <AppServicesLoading/>;
  }

  const props = {
    kafkaPageLink: history.createHref({
      pathname: '/streams/kafkas'
    }),
    kafkaInstanceLink: history.createHref({
      pathname: `/streams/kafkas/${kafkaDetail.id}`
    }),
    showMetrics: <Metrics kafkaId={kafkaDetail.id}/>,
    onError: (code: number) => {
      setError(code);
    },
    kafkaName: kafkaDetail.name,
    apiBasePath: adminServerUrl,
    getToken: auth?.kafka.getToken,
    handleInstanceDrawer,
    setIsOpenDeleteInstanceModal
  } as UnderlyingProps;

  if (error === 401) {
    return (
      <AccessDeniedPage/>
    )
  }

  return (
    <div className="app-services-ui--u-display-contents" data-ouia-app-id="dataPlane-streams">
      <PrincipalsProvider kafkaInstance={kafkaDetail}>
        <InstanceDrawer
          isExpanded={isInstanceDrawerOpen}
          onClose={onCloseInstanceDrawer}
          kafkaDetail={kafkaDetail}
          activeTab={activeDrawerTab}
          isOpenDeleteInstanceModal={isOpenDeleteInstanceModal}
          setIsOpenDeleteInstanceModal={setIsOpenDeleteInstanceModal}
        >
          <Switch>
            {flattenedRoutes(kafkaRoutes).map(({ path, exact, component, title, isAsync, ...rest }, idx) => {
              const routePath = `${routeMatch.path}${path}`;
              console.log(`Creating route for ${routePath}`);
              return (
                <WrappedRoute
                  path={routePath}
                  exact={exact}
                  component={component}
                  key={idx}
                  title={title}
                  isAsync={isAsync}
                  underlyingProps={props}
                  url={routeMatch.url}
                  {...rest}
                />
              )
            })}
            <PageNotFoundRoute title="404 Page Not Found"/>
          </Switch>
        </InstanceDrawer>
      </PrincipalsProvider>
    </div>

  );
}


export { KafkaRoutes, kafkaRoutes };
