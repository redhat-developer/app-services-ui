import React from 'react';
import { Loading } from '@app/components/Loading/Loading';
import LoremIpsum from 'react-lorem-ipsum';
import {
  PageSection,
  PageSectionVariants,
  TextContent,
  Text,
  TextVariants,
  Title,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  CardHeaderMain,
  CardTitle,
  Button,
  ButtonVariant,
  Stack,
  StackItem,
  TitleSizes,
  Grid,
  GridItem,
  List,
  ListItem,
} from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import '../../App.scss';
import { useTranslation } from 'react-i18next';

export const APIManagementPage: React.FunctionComponent = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageSection
        className="app-services-ui--banner app-services-ui--banner--rhoam"
        variant={PageSectionVariants.light}
      >
        <Stack hasGutter>
          <Title headingLevel="h1" size="2xl">
            {t('apimgmtoverview.heroTitle')}
          </Title>
          <Title headingLevel="h2" size="lg" className="app-services-ui--banner__tagline pf-u-color-200">
            {t('apimgmtoverview.heroTagline')}
          </Title>
          <Text component={TextVariants.p}>{t('apimgmtoverview.heroDescription')}</Text>
        </Stack>
      </PageSection>

      <PageSection className="app-services-ui--page-section--marketing" isWidthLimited>
        <Grid hasGutter lg={6}>
          <Card>
            <CardHeader>
              <CardHeaderMain>
                <CardTitle>
                  <Title headingLevel="h3">{t('apimgmtoverview.alreadyHaveCardTitle')}</Title>
                </CardTitle>
              </CardHeaderMain>
            </CardHeader>
            <CardBody>{t('apimgmtoverview.alreadyHaveCardMainText')}</CardBody>
            <CardFooter>
              <Stack hasGutter>
                <StackItem>
                  <Button
                    data-testid="cardHaveRHOAM-buttonGoOCM"
                    variant={ButtonVariant.secondary}
                    component="a"
                    href="https://cloud.redhat.com/openshift/"
                  >
                    {t('apimgmtoverview.alreadyHaveCardCallToActionButton')}
                  </Button>
                </StackItem>
                <StackItem>
                  <Button
                    data-testid="cardHaveRHOAM-linkViewDocs"
                    variant={ButtonVariant.link}
                    component="a"
                    href="https://access.redhat.com/products/red-hat-openshift-api-management"
                    target="_blank"
                  >
                    {t('apimgmtoverview.viewDocumentation')} <ExternalLinkAltIcon className="pf-u-ml-sm" />
                  </Button>
                </StackItem>
              </Stack>{' '}
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <Title headingLevel="h3">{t('apimgmtoverview.wantToTryCardTitle')}</Title>
              </CardTitle>
            </CardHeader>
            <CardBody>{t('apimgmtoverview.wantToTryCardMainText')}</CardBody>
            <CardFooter>
              <Stack hasGutter>
                <StackItem>
                  <Button
                    data-testid="cardTryRHOAM-buttonGetStarted"
                    variant={ButtonVariant.secondary}
                    component="a"
                    href="https://developers.redhat.com/products/rhoam/getting-started"
                    target="_blank"
                  >
                    {t('apimgmtoverview.wantToTryCardCallToActionButton')}
                    <ExternalLinkAltIcon className="pf-u-ml-md" />
                  </Button>
                </StackItem>
                <StackItem>
                  <Button
                    data-testid="cardTryRHOAM-linkViewDocs"
                    variant={ButtonVariant.link}
                    component="a"
                    href="https://access.redhat.com/products/red-hat-openshift-api-management"
                    target="_blank"
                  >
                    {t('apimgmtoverview.viewDocumentation')} <ExternalLinkAltIcon className="pf-u-ml-sm" />
                  </Button>
                </StackItem>
              </Stack>
            </CardFooter>
          </Card>
        </Grid>
      </PageSection>

      <PageSection variant={PageSectionVariants.light} className="app-services-ui--page-section--marketing" isWidthLimited>
        <Title size={TitleSizes.xl} headingLevel="h3" className="pf-u-mb-lg">
          {t('apimgmtoverview.videoSectionTitle')}
        </Title>
        <Grid hasGutter>
          <GridItem md={7}>
            <Card className="app-services-ui--card--video">
              <div className="app-services-ui--video-wrapper">
                <iframe
                  src="https://www.youtube.com/embed/NzNgc0f75pc"
                  title={t('apimgmtoverview.videoSectionTitle')}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </Card>
          </GridItem>
          <GridItem md={5}>
            <TextContent>
              <Text className="pf-u-color-200 pf-u-ml-md">{t('apimgmtoverview.videoSectionInThisVideo')}</Text>
              <List className="app-services-ui--icon-list">
                <ListItem>{t('apimgmtoverview.videoSectionBulletBuild')}</ListItem>
                <ListItem>{t('apimgmtoverview.videoSectionBulletImport')}</ListItem>
                <ListItem>{t('apimgmtoverview.videoSectionBulletAdd')}</ListItem>
              </List>
            </TextContent>
          </GridItem>
        </Grid>
      </PageSection>
    </>
  );
};
