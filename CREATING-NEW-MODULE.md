# Creating a new MicroFrontend to Application Services UI

The Application Services UI is developed as a series of micro-frontends. The Application Services UI app is the host app for all the micro-frontends that make up Managed Services. Each micro-frontend is integrated using [Webpack Module Federation](https://webpack.js.org/concepts/module-federation/) which allows us to have each individual micro-frontend developed and deployed individually and integrated at runtime in the end users browser.

One or more micro-frontends are stored in a Git repository (normally on [GitHub](https://github.com) if the micro-frontend is open source, or on [GitLab](https://gitlab.cee.redhat.com/) if the micro-frontend isn't open source). The entire set of micro-frontends are stored in many Git repositories.

Each git repository results in one (or more) Webpack builds and the output of the Webpack build is  is deployed to a path on cloud.redhat.com (e.g. https://cloud.redhat.com/beta/apps/rhosak-control-plane-ui-build)

Each micro-frontend is loaded on demand from that path at runtime using [React Suspense](https://reactjs.org/docs/concurrent-mode-suspense.html). This means that not all the micro-frontends that need loading up front. 

NOTE: Multiple micro-frontends can be stored in the same git repository, and built by the same Webpack build.

If you are developing locally you need to run a webpack dev server for each . As the micro-frontends are loaded on demand, with a fallback, not all micro-frontends need to be running for you to develop your micro-frontend.

Most micro-frontends are assigned to a URL path subtree of the application. Some provide "shared functionality" (functionality that other micro-frontends can reuse e.g. the quick start drawer from the `guides` micro-frontend) and can be used in other ways (in our quick start drawer example as a parent component for all other micro-frontends).

## Adding a new micro-frontend from a new Git repository

NOTE: If you already have a git repository set up to deploy a federated module to cloud.redhat.com that you are reusing, you can skip creating the GitHub build repo and configuring deployment to Akamai, as well as setting the CI in app-interface. 

### Creating the GitHub build repo

We use the cloud.redhat.com deployment system (based on the Akamai Content Delivery Network) to send the assets to the user. In order to deploy the assets, you add them to a branch on a GitHub repo, and a cloud.redhat.com CI job will sync them to Akamai (or equivalent for staging).

To set this up you need to create a minimal new app on [cloud-services-config](https://github.com/RedHatInsights/cloud-services-config) repo as demonstrated by [this commit](https://github.com/RedHatInsights/cloud-services-config/commit/7316dba0dddbf4e1abcf7c1057c055b8eb4e2b01#diff-c608be8e36b8dbaba0b0fc0d75c28bc58ab3a27167774c46f31f14319931c693R693-R696). You should leave a comment on the PR asking the person who merges it to set up the deployment repo, listing the GitHub usernames of any users who need write access.


### Adding a menu item

The cloud.redhat.com main meny is also driven by the [cloud-services-config](https://github.com/RedHatInsights/cloud-services-config) repo. The Application Services app is called `application-servces` and [this commit](https://github.com/RedHatInsights/cloud-services-config/commit/7316dba0dddbf4e1abcf7c1057c055b8eb4e2b01#diff-c608be8e36b8dbaba0b0fc0d75c28bc58ab3a27167774c46f31f14319931c693R672-R674) shows how to add a top level menu item. The `id` is also used as the subpath under `application-services/`. Nested menus are supported; an example is "Streams for Apache Kafka" which is configured using [this block])(https://github.com/RedHatInsights/cloud-services-config/commit/7316dba0dddbf4e1abcf7c1057c055b8eb4e2b01#diff-c608be8e36b8dbaba0b0fc0d75c28bc58ab3a27167774c46f31f14319931c693R631-R644). The [cloud-services-config](https://github.com/RedHatInsights/cloud-services-config) repo provides additional reference docs for the menu system.

### Exposing your micro-frontend for federation

To expose your micro-frontend for federation you must:

* Update the webpack version to 5.x (we recommend the latest release)
* Update the webpack plugins to 5.x compatible versions (we recommend the latest versions)

Advice on how to update webpack can be found in the [migration guide](https://webpack.js.org/migrate/5/).

Then you must add configuration to your common webpack configuration:

```js
const {dependencies, scopeName} = require("./package.json");
const webpack = require('webpack');
```

```js
      new webpack.container.ModuleFederationPlugin({
        name: scopeName,
        filename: `${scopeName}${isProduction ? '[chunkhash:8]' : ''}.js`,
        exposes: {
          "./<MicroFrontendName>": ".<MicroFrontendPath>",
        },
        shared: {
          ...dependencies,
          react: {
            eager: true,
            singleton: true,
            requiredVersion: dependencies["react"],
          },
          "react-dom": {
            eager: true,
            singleton: true,
            requiredVersion: dependencies["react-dom"],
          },
        },
      })
```

kas-ui provides an [example of this](https://github.com/bf2fc6cc711aee1a0c2a/kas-ui/blob/main/webpack.common.js#L167-L189).


Update `package.json` to add the `scopeName`, kas-ui provides an [example of this](https://github.com/bf2fc6cc711aee1a0c2a/kas-ui/blob/main/package.json#L3)

### Adding configuration for the micro-frontend

In order for the Application Services UI to load the new micro-frontend you must add update the configuration to include references to the micro-frontend's deployment path. Open the `config/config.json` file in this repository.

The configuration file allows different configuration for each supported environment (currently local development aka prod.foo.redhat.com, qaprodauth.cloud.redhat.com and production aka cloud.redhat.com) - so you'll need to specify the micro-frontend location for each environment.

Locate the configuration block for local development (prod.foo.redhat.com) and add a new entry to the `federatedModules`; normally for local development you'll use a new port on localhost - this should match your webpack dev configuration. The name of federated micro-frontend must match the `scopeName`. For example:

```json
      "federatedModules": {
        "kas": {
          "basePath": "http://localhost:9999",
          "entryPoint": "fed-mods.json"
        },
        ...
      }
```

Now locate the configuration block for qaprodauth and production, and add your micro-frontend; normally you will use a path like `/beta/apps/<app-name>`. For example:

```json
      "federatedModules": {
        "acme": {
          "basePath": "/beta/apps/acme-ui-build"
          "entryPoint": "fed-mods.json",
        },
      }  
```

The `fed-mods.json` entry point allow us to bust the cache when loading the micro-frontend in production as Akamai generally sends assets with long expiry dates, however JSON files are always refreshed. First the app will load the `fed-mods.json` file (which is created by the micro-frontend build), parse the file, then load the micro-frontend entry point `<contenthash>.js` file.

To generate the `fed-mods.json` file add the `ChunkMapper` from the `@redhat-cloud-services/frontend-components-config` dependency. Add this dependency to the common webpack config for your micro-frontend:

```js
const ChunkMapper = require('@redhat-cloud-services/frontend-components-config/chunk-mapper')
```

And this plugin:

```js
      new ChunkMapper({
        modules: [
          scopeName
        ]
      }),
```

### Adding the host page

In order to have the micro-frontend show up in the UI we need to add a host page. Start by copying the `src/app/pages/Template` directory, replacing `Template` with the name of your micro-frontend, making sure you use camel case. You will need to replace `MicroFrontendName` and `ScopeName`.

Further, you need to update `src/app/Config/Config.tsx` with a new entry for your scope in the `federatedModules` block e.g.

```ts
  federatedModules: {
    kas: FederMicroFrontendConfig
  }
```

Finally, you need to add a route. Edit `src/app/Routes.tsx`. Locate the `AppRouteConfig` array and add a new entry like:

```ts

  {
    component: MicroFrontendNamePage,
    exact: false,
    label: 'MicroFrontendName',
    path: '/id',
    title: 'MicroFrontendName',
  },
```

You will need to replace `MicroFrontendName` and `id` (with the id you used in the `cloud-services-config`).

### Deploying to qaprodauth

The first staging environment we use is https://qaprodauth.cloud.redhat.com which is inside the VPN. To make your first deploy to this environment simply push to the `qa-beta` branch. You will also need to create a merge request with the changes to the application-services-ui for review.

## Setting up CI/CD for your new git repository

An overview of the CI/CD for apps is described in the [Application Services UI - CI/CD](https://docs.google.com/document/d/1tVTMyY4pC-qZoCuC_wM1gnj9Cy-6sDZbSbWAJaC7OVk/edit#heading=h.g8cev17tczt) document.

### Create and sync the midstream

Create a new project in https://gitlab.cee.redhat.com/mk-ci-cd - naming it the same as the upstream project. You need to create a default branch called `mk-release` and a branch called `main`.

Then update the synchronization config in https://gitlab.cee.redhat.com/mk-ci-cd/mk-ci-tools/-/blob/master/script/repo-config.yaml adding a new entry to the `projects` array:

```yaml
  -
    name: "<repo name>"
    bf2bot: true
    upstream-repo: "https://github.com/<upstream org>/<repo name>"
    midstream-repo: "gitlab.cee.redhat.com/mk-ci-cd/<repo name>.git"
    midstream-repo-id: "<project id>"
    branches:
      -
        upstream: "main"
        midstream-base: "main"
        midstream-target: "mk-release"

```

The project id can be found in the settings for the midstream repo.

The sync will run when the change to the `repo-config.yaml` is merged, creating a Merge Request on the repo with the current upstream state. Merge this MR.

### Add the build files

There are four build files to add to the repo:

1. Copy https://gitlab.cee.redhat.com/mk-ci-cd/kas-ui/-/blob/mk-release/build_deploy.sh to the `mk-release` branch on the midstream repo, updating the `IMAGE_REPOSITORY` to the `<repo name>` 

2. Copy https://gitlab.cee.redhat.com/mk-ci-cd/kas-ui/-/blob/mk-release/pr_check.sh to the `mk-release` branch on the midstream repo, updating `docker build -t ...` to `docker build -t <repo name>`

3. Copy https://gitlab.cee.redhat.com/mk-ci-cd/kas-ui/-/blob/mk-release/insights-Jenkinsfile to the `mk-release` branch on the midstream repo

4. Copy https://gitlab.cee.redhat.com/mk-ci-cd/kas-ui/-/blob/mk-release/hack/push_to_insights.sh to the `hack` directory on the `mk-release` branch on the midstream repo, updating the `INSIGHTS_REPOSTORY` to the name of the repo created in the `cloud-services-config`

Push these to the repo.

### Add the job to app-interface

Follow the [Managed Kafka CI/CD Guide](https://docs.google.com/document/d/1IHVHjg59zrjY0t4LwyNk5auUw0dWhzD3f59ytB5Ik14/edit#heading=h.uwl2mdrkd0bi) to add the job to app-interface.

## Global Components

TODO

## Component Libraries

TODO

## FAQs

### How do I do cache busting when using Akamai in production?

Use the [standard Webpack support for generating hased file names](https://webpack.js.org/guides/caching/). Make sure you apply this to the entry point of your federated modules as described above. Also make sure you apply this to all assets output including CSS, fonts and images. JSON files are not cached so can be left with unhashed file names 

