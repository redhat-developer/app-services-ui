import React from 'react';
import WrenchIcon from '@patternfly/react-icons/dist/js/icons/wrench-icon';
import { PageSection, Title, Button, EmptyState, EmptyStateIcon, EmptyStateBody } from '@patternfly/react-core';
import { useTranslation } from 'react-i18next';

export const ServiceDownPage: React.FunctionComponent = () => {
  const { t } = useTranslation(['appTemporaryFixMe']);
  return (
    <PageSection>
      <EmptyState variant="full">
        <EmptyStateIcon icon={WrenchIcon} />
        <Title headingLevel="h1" size="lg">
          {t('serviceDown.serviceDownTitle')}
        </Title>
        <EmptyStateBody>{t('serviceDown.serviceDownMessage')}</EmptyStateBody>
        <Button
          variant="primary"
          onClick={() => {
            window.location.href = 'https://status.starter.openshift.com/';
          }}
        >
          {t('serviceDown.serviceDownButton')}
        </Button>
      </EmptyState>
    </PageSection>
  );
};
