import React from 'react';
import { Loading } from '@app/Components/Loading/Loading';
import LoremIpsum from 'react-lorem-ipsum';
import {
  Bullseye,
  Button,
  ButtonVariant,
  Card,
  CardActions,
  CardBody,
  CardHeader,
  CardTitle,
  Gallery,
  GalleryItem,
  Grid,
  GridItem,
  List,
  ListItem,
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
import videoPlaceholder from 'static/images/Videoplaceholder.svg';

import { useTranslation } from 'react-i18next';

export const DataSciencePage: React.FunctionComponent = () => {
  const { t } = useTranslation();

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

      <PageSection className="app-services-ui--page-section--video">
        <Grid hasGutter>
          <GridItem md={5}>
            <TextContent>
              <Title size={TitleSizes.xl} headingLevel="h3" className="pf-u-mb-lg">
                {t('datascienceoverview.videoSectionTitle')}
              </Title>
              <Text className="pf-u-mr-md">{t('datascienceoverview.videoSectionInThisVideo')}</Text>
            </TextContent>
          </GridItem>
          <GridItem md={7}>
            <Card>
              <Bullseye>
                <img src={videoPlaceholder} />
              </Bullseye>
            </Card>
              {/* Replace the card above with this once there is a video */}
              {/* <Card className="app-services-ui--card--video">
                <div className="app-services-ui--video-wrapper">
                  <iframe
                    src="URL HERE"
                    title={t('datascienceoverview.videoSectionTitle')}
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                  ></iframe>
                </div>
              </Card> */}
          </GridItem>
        </Grid>
      </PageSection>
    </>
  );
};
