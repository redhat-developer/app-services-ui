[![Build Status](https://travis-ci.org/RedHatInsights/insights-frontend-starter-app.svg?branch=master)](https://travis-ci.org/RedHatInsights/insights-frontend-starter-app)

# Application Services UI

mk-ui is based on the https://github.com/RedHatInsights/insights-frontend-starter-app.git which is React.js starter app for Red Hat Insights products that includes Patternfly 4 and shared cloud.redhat.com services

## Services 

- Managed Kafka UI (https://github.com/bf2fc6cc711aee1a0c2a/kas-ui)
- Kafka instance UI (https://github.com/bf2fc6cc711aee1a0c2a/kafka-ui)
- Guides (https://github.com/bf2fc6cc711aee1a0c2a/guides)
- Service Registry UI (https://github.com/bf2fc6cc711aee1a0c2a/srs-ui)

## Running Project

### Prerequisites

- Docker 
- NVM (node version manager)

## Initial dev setup

```
./scripts/checkout-repos.sh
```
This will download all required repositories for development and setup insights container

## Running project

```
./scripts/run.sh
```

Go to https://prod.foo.redhat.com:1337/beta/application-services/streams/kafkas
