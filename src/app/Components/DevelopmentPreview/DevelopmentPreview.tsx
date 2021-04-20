import React from 'react';
import { Banner, Bullseye, Button, Popover } from '@patternfly/react-core';
import { useTranslation } from 'react-i18next';

export const DevelopmentPreview: React.FunctionComponent = ({ children }) => {
  const { t } = useTranslation();
  return <div className='app-services-ui--u-display-contents'>
    <Banner isSticky variant="info">
      <Bullseye>  
        <Popover
          aria-label="Development Preview Button"
          hasAutoWidth
          bodyContent={
                <div>{t('common.developmentPreviewTooltip')}</div>
              }
          position='bottom'
          minWidth='300px'
          maxWidth='25%'> 
            <div>{t('common.developmentPreview')}</div>
          </Popover>
      </Bullseye> 
    </Banner>
    {children}
  </div>
}