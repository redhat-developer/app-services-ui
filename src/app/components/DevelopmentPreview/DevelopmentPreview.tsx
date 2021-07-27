import React from 'react';
import { Banner, Bullseye, Button, Popover } from '@patternfly/react-core';
import { useTranslation } from 'react-i18next';

export type DevelopmentPreviewProps = {
  show?: boolean
}

export const DevelopmentPreview: React.FunctionComponent<DevelopmentPreviewProps> = ({ children, show }) => {
  const { t } = useTranslation();
  if (show) {
    return <div id='scrollablePageMain' className='pf-c-page__main' style={{ height: '100%' }}>
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
            <Button className='app-services-ui--button--dev-preview' variant='link'>{t('common.developmentPreview')}</Button>
          </Popover>
        </Bullseye>
      </Banner>
      {children}
    </div>
  }
  return (
    <>{children}</>
  )
}
