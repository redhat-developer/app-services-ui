[![Build Status](https://travis-ci.org/RedHatInsights/insights-frontend-starter-app.svg?branch=master)](https://travis-ci.org/RedHatInsights/insights-frontend-starter-app)

# Application Services UI

User interface for Red Hat Managed Services (Kafka, Service Registry etc.) that is available as part of the https://console.redhat.com

Application Services UI is based on the https://github.com/RedHatInsights/insights-frontend-starter-app.git which is React.js starter app for Red Hat Insights products that includes Patternfly 4 and shared cloud.redhat.com services


## Services 

- Managed Kafka UI (https://github.com/bf2fc6cc711aee1a0c2a/kas-ui)
- Kafka instance UI (https://github.com/bf2fc6cc711aee1a0c2a/kafka-ui)
- Service Registry UI (https://github.com/bf2fc6cc711aee1a0c2a/srs-ui)
- API Designer UI (https://github.com/bf2fc6cc711aee1a0c2a/ads-ui)
- Guides (https://github.com/redhat-developer/app-services-guides)

## Running Project

Project can be run in two modes:

- Using remote federated components from console.redhat.com (only for Red Hat Internal usage)
- Running federated modules locally (dev)

## Running project with remote components

Run:
```
npm install
npm run start:dev
```

Go to https://prod.foo.redhat.com:1337/beta/application-services/streams/kafkas

## Running project with compiled components

#### Setting up all repositories for development

First we need to download all external repositories by running a script.

```
./hack/checkout-repos.sh
```

After that we can run any of the federated UI component in `./modules` folder and it will automatically be used by the app-services-ui

## Running UI against custom backend

Developers running UI locally can use multiple environments to point as backends that UI should use for authentication. To point UI to different services please modify your configuration locally:

https://github.com/redhat-developer/app-services-ui/blob/main/config/config.json

For example for configuring UI to run against Kas-installer we can change  
kas.apiBasePath value to our custom cluser

Please note if you running service thru (kas-installer)[https://github.com/bf2fc6cc711aee1a0c2a/kas-installer] you might need to add different cors orgins settings in individual backends. 

## Contributing Guide

[CONTRIBUTING](./CONTRIBUTING.md)

 
## Creating new Module Guide

[New module guide](./CREATING-NEW-MODULE.md)

## Testing changes to nav

1. Edit `webpack.dev.js` and add the following to `proxyConfig`: 
```
    routes: {
      '/config': { host: 'http://127.0.0.1:8889' },
      '/beta/config': { host: 'http://127.0.0.1:8889' }
    },
```
2. Clone https://github.com/RedHatInsights/cloud-services-config and follow the instructions there to make your changes
3. run npx http-server -p 8889 in cloud-services-config to try the changes out
