[![Build Status](https://travis-ci.org/RedHatInsights/insights-frontend-starter-app.svg?branch=master)](https://travis-ci.org/RedHatInsights/insights-frontend-starter-app)

> NOTE: This project is still under active development

# Application Services UI

Application Services UI is based on the https://github.com/RedHatInsights/insights-frontend-starter-app.git which is React.js starter app for Red Hat Insights products that includes Patternfly 4 and shared cloud.redhat.com services

## Services 

- Managed Kafka UI (https://github.com/bf2fc6cc711aee1a0c2a/kas-ui)
- Kafka instance UI (https://github.com/bf2fc6cc711aee1a0c2a/kafka-ui)
- Service Registry UI (https://github.com/bf2fc6cc711aee1a0c2a/srs-ui)
- Guides (https://github.com/redhat-developer/app-services-guides)

## Running Project

Project can be run in two modes:

- Using remote federated components from console.redhat.com
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

 
## Contributing Guide

[CONTRIBUTING](./CONTRIBUTING.md)

 
## Creating new Module Guide

[New module guide](./CREATING-NEW-MODULE.md)
