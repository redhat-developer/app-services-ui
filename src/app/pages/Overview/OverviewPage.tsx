import React from 'react';
import {
  Bullseye,
  Button,
  ButtonVariant,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardHeaderMain,
  CardTitle,
  Grid,
  Label,
  PageSection,
  PageSectionVariants,
  Stack,
  StackItem,
  Text,
  TextVariants,
  Title,
} from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import ApacheKafkaLogo from "/static/images/Logo-Red_Hat-OpenShift_Streams_for_Apache_Kafka-A-Standard-RGB.svg";
import APIMgmtLogo from "/static/images/Logo-Red_Hat-OpenShift-API_Management-A-Standard-RGB.svg";
import DataScienceLogo from "static/images/Logo-Red_Hat-OpenShift-Data_Science-A-Standard-RGB.svg";
import ServiceRegistryLogo from "static/images/Logo-Red_Hat-OpenShift_Service_Registry-A-Standard-RGB.png"

import { useTranslation } from 'react-i18next';

import { useHistory } from 'react-router-dom';
import { useBasename } from '@rhoas/app-services-ui-shared';

export const OverviewPage: React.FunctionComponent = () => {

  const { t } = useTranslation();

  const history = useHistory();
  const { getBasename } = useBasename() || { getBasename: () => '' };
  const basename = getBasename();

  const onClickKafkainstance = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    history.push(`${basename}/streams/kafkas`);
  }

  const kafkaHref = history.createHref({
    pathname: '/streams/kafkas'
  })


  const onClickServiceRegistry = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    history.push(`${basename}/service-registry`);
  }

  const serviceRegistryHref = history.createHref({
    pathname: '/service-registry'
  })

  return (
    <>
      {/* Hero banner with graphic */}
      <PageSection className="app-services-ui--page-section--marketing app-services-ui--banner pf-t-dark pf-u-background-color-dark-100" variant={PageSectionVariants.dark}>
        <Stack hasGutter>
          <Title headingLevel="h1" size="2xl">
            {t('overview.heroTitle')}
          </Title>
          <Text className="app-services-ui--banner__tagline">{t('overview.heroTagline')}</Text>
          <Text component={TextVariants.p}>
            {t('overview.heroDescription')}
          </Text>
          <Text component={TextVariants.p} className="pf-u-mt-md">
            {t('overview.heroDescription2')}
          </Text>
          <StackItem>
            <Button variant={ButtonVariant.primary} isLarge component="a" data-testid="hero-buttonTryKafka" href={kafkaHref} onClick={onClickKafkainstance}>
              {t('overview.heroCallToActionButton')}
            </Button>
          </StackItem>
        </Stack>
      </PageSection>

      {/* Banner with just text */}
      <PageSection variant={PageSectionVariants.light} className="app-services-ui--page-section--marketing">
        <Bullseye>
          <Text component={TextVariants.p} className="app-services-ui--banner--text-only">
            {t('overview.banner')}
          </Text>
        </Bullseye>
      </PageSection>

      {/* Cards */}
      <PageSection isWidthLimited className="app-services-ui--page-section--marketing">
        <Grid md={6} lg={3} hasGutter>

          {/* API Management card */}
          <Card>
            <CardHeader>
              <CardHeaderMain>
                <img
                  src={APIMgmtLogo}
                  alt="Red Hat OpenShift API Management logo"
                  style={{ height: '50px' }}
                />
              </CardHeaderMain>
            </CardHeader>
            <CardTitle>
              <Title headingLevel="h2" size="xl">
                {t('overview.rhoamTitle')}
              </Title>
            </CardTitle>
            <CardBody>
              <Stack hasGutter>
                <StackItem className="pf-u-mb-lg">
                  <Label color="blue">{t('overview.generalAvailability')}</Label>
                </StackItem>
                <StackItem>
                  {t('overview.rhoamMainText')}
                </StackItem>
                <StackItem className="pf-u-color-200">
                  {t('overview.rhoamSecondaryText')} <Button data-testid="cardRHOAM-linkOpenShift" isInline variant={ButtonVariant.link} component="a" target="_blank" href="http://openshift.com">OpenShift
                    <ExternalLinkAltIcon className="pf-u-ml-xs" /></Button>.
                </StackItem>
              </Stack>
            </CardBody>
            <CardFooter>
              <Button variant={ButtonVariant.secondary} data-testid="cardRHOAM-buttonCTA" component="a" target="_blank" href="https://developers.redhat.com/products/rhoam/getting-started">
                {t('overview.getStarted')} <ExternalLinkAltIcon className="pf-u-ml-sm" />
              </Button>
            </CardFooter>
          </Card>

          {/* Data science card */}
          <Card>
            <CardHeader>
              <CardHeaderMain>
                <img
                  src={DataScienceLogo}
                  alt="Red Hat OpenShift Data Science logo"
                  style={{ height: '50px' }}
                />
              </CardHeaderMain>
            </CardHeader>
            <CardTitle>
              <Title headingLevel="h2" size="xl">
                {t('overview.rhodsTitle')}
              </Title>
            </CardTitle>
            <CardBody>
              <Stack hasGutter>
                <StackItem className="pf-u-mb-lg">
                  <Label>{t('overview.beta')}</Label>
                </StackItem>
                <StackItem>
                  {t('overview.rhodsMainText')}
                </StackItem>
                <StackItem className="pf-u-color-200">
                  {t('overview.rhodsSecondaryText')} <Button data-testid="cardRHODS-linkOpenShift" isInline variant={ButtonVariant.link} component="a" target="_blank" href="http://openshift.com"> OpenShift
                    <ExternalLinkAltIcon className="pf-u-ml-xs" /></Button>.
                </StackItem>
              </Stack>
            </CardBody>
            <CardFooter>
              <Button data-testid="cardRHODS-buttonCTA" variant={ButtonVariant.secondary} component="a" target="_blank" href="https://www.redhat.com/en/technologies/cloud-computing/openshift/openshift-data-science">
                {t('overview.learnMore')} <ExternalLinkAltIcon className="pf-u-ml-sm" />
              </Button>
            </CardFooter>
          </Card>

          {/* Service Registry card */}
          <Card>
            <CardHeader>
              <CardHeaderMain>
                <img
                  src={ServiceRegistryLogo}
                  alt="Red Hat OpenShift Service Registry logo"
                  style={{ height: '50px' }}
                />
              </CardHeaderMain>
            </CardHeader>
            <CardTitle>
              <Title headingLevel="h2" size="xl">
                {t('overview.rhosrTitle')}
              </Title>
            </CardTitle>
            <CardBody>
              <Stack hasGutter>
                <StackItem className="pf-u-mb-lg">
                  <Label>{t('overview.developmentPreview')}</Label>
                </StackItem>
                <StackItem>
                  {t('overview.rhosrMainText')}
                </StackItem>
                <StackItem className="pf-u-color-200">
                  {t('overview.rhosrSecondaryText')}
                </StackItem>
              </Stack>
            </CardBody>
            <CardFooter>
              <Button data-testid="cardRHOSR-buttonCTA" variant={ButtonVariant.secondary} component="a" href={serviceRegistryHref} onClick={onClickServiceRegistry}>{t('overview.rhosrCallToActionButton')}</Button>
            </CardFooter>
          </Card>

          {/* Kafka card */}
          <Card>
            <CardHeader>
              <CardHeaderMain>
                <img
                  src={ApacheKafkaLogo}
                  alt="Red Hat OpenShift Streams for Apache Kafka logo"
                  style={{ height: '50px' }}
                />
              </CardHeaderMain>
            </CardHeader>
            <CardTitle>
              <Title headingLevel="h2" size="xl">
                {t('overview.rhosakTitle')}
              </Title>
            </CardTitle>
            <CardBody>
              <Stack hasGutter>
                <StackItem className="pf-u-mb-lg">
                  <Label>{t('overview.developmentPreview')}</Label>
                </StackItem>
                <StackItem>
                  {t('overview.rhosakMainText')}
                </StackItem>
                <StackItem className="pf-u-color-200">
                  {t('overview.rhosakSecondaryText')}
                </StackItem>
              </Stack>
            </CardBody>
            <CardFooter>
              <Button data-testid="cardRHOSAK-buttonCreateKafka" variant={ButtonVariant.secondary} component="a" href={kafkaHref} onClick={onClickKafkainstance} >{t('overview.rhosakCallToActionButton')}</Button>
            </CardFooter>
          </Card>
        </Grid>
      </PageSection>
    </>
  );
};

export default OverviewPage;
