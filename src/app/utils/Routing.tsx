import { ComponentType, FunctionComponent, lazy } from "react";
import { Route, RouteComponentProps } from "react-router-dom";
import { useDocumentTitle } from "@app/utils";

const NotFoundPage = lazy(() => import("@app/pages/NotFound/NotFoundPage"));

export interface IAppRoute<T> {
  label?: string; // Excluding the label will exclude the route from the nav sidebar in AppLayout
  /* eslint-disable @typescript-eslint/no-explicit-any */
  component: ComponentType<RouteComponentProps> | ComponentType<T>;
  /* eslint-enable @typescript-eslint/no-explicit-any */
  exact?: boolean;
  path: string;
  title: string;
  isAsync?: boolean;
  routes?: undefined;
  basename?: string;
  devPreview?: boolean;
}

export interface IAppRouteGroup<T> {
  label: string;
  routes: IAppRoute<T>[];
}

export type AppRouteConfig<T> = IAppRoute<T> | IAppRouteGroup<T>;

export const PageNotFoundRoute: FunctionComponent<{ title: string }> = ({
  title,
}: {
  title: string;
}) => {
  useDocumentTitle(title);
  return <Route component={NotFoundPage} />;
};

export const flattenedRoutes = <T,>(routes: AppRouteConfig<T>[]) =>
  routes.reduce(
    (flattened, route) => [
      ...flattened,
      ...(route.routes ? route.routes : [route]),
    ],
    [] as IAppRoute<T>[]
  );
