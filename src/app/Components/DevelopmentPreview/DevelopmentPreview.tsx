import React from 'react';
import { Banner, Bullseye } from '@patternfly/react-core';
import { useTranslation } from 'react-i18next';

export const DevelopmentPreview: React.FunctionComponent = ({ children }) => {
  const { t } = useTranslation();
  return <div className='app-services-ui--u-display-contents'>
    <Banner isSticky variant="info"><Bullseye> {t('common.developmentPreview')} </Bullseye> </Banner>
    {children}
  </div>
}