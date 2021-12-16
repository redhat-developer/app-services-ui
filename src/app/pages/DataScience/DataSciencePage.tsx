import React from 'react';
import {
  Button,
  ButtonVariant,
  Card,
  Grid,
  GridItem,
  PageSection,
  PageSectionVariants,
  Stack,
  StackItem,
  Text,
  TextContent,
  TextVariants,
  Title,
  TitleSizes,
} from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';

import { useTranslation } from 'react-i18next';

export const DataSciencePage: React.FunctionComponent = () => {
  const { t } = useTranslation(['appTemporaryFixMe']);

  return (
    <>
      <PageSection
        className="app-services-ui--banner app-services-ui--banner--rhods"
        variant={PageSectionVariants.light}
      >
        <Stack hasGutter>
          <Title headingLevel="h1" size="2xl">
            {t('datascienceoverview.heroTitle')}
          </Title>
          <Title headingLevel="h2" size="lg" className="app-services-ui--banner__tagline pf-u-color-200">
            {t('datascienceoverview.heroTagline')}
          </Title>
          <Text component={TextVariants.p}>{t('datascienceoverview.heroDescription')}</Text>
          <StackItem>
            <Button
              data-testid="hero-buttonLearnMore"
              variant={ButtonVariant.secondary}
              component="a"
              href="https://www.redhat.com/en/technologies/cloud-computing/openshift/openshift-data-science"
              target="_blank"
            >
              {t('datascienceoverview.heroCallToActionButton')} <ExternalLinkAltIcon className="pf-u-ml-sm" />
            </Button>
          </StackItem>
        </Stack>
      </PageSection>

      <PageSection className="app-services-ui--page-section--marketing" isWidthLimited>
        <Grid hasGutter>
          <GridItem md={5}>
            <Stack hasGutter>
              <StackItem>
                <TextContent>
                  <Title size={TitleSizes.xl} headingLevel="h3" className="pf-u-mb-lg">
                    {t('datascienceoverview.videoSectionTitle')}
                  </Title>
                  <Text className="pf-u-mr-md">{t('datascienceoverview.videoSectionInThisVideo')}</Text>
                </TextContent>
              </StackItem>
              <StackItem>
                <Button
                  data-testid="CTA-videoRHODSDemo"
                  variant={ButtonVariant.secondary}
                  component="a"
                  href="http://www.openshift.com/DataScienceVideoDemo"
                  target="_blank"
                >
                  {t('datascienceoverview.heroViewDemo')} <ExternalLinkAltIcon className="pf-u-ml-sm" />
                </Button>
              </StackItem>
            </Stack>
          </GridItem>
          <GridItem md={7}>
            <Card className="app-services-ui--card--video">
              <div className="app-services-ui--video-wrapper">
                <iframe
                  src="https://www.youtube.com/embed/joK89xYeuUY"
                  title={t('datascienceoverview.videoSectionTitle')}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </Card>
          </GridItem>
        </Grid>
      </PageSection>
    </>
  );
};

export default DataSciencePage;
