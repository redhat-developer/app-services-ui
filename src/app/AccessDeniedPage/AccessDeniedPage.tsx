import React from 'react';

import { Main, NotAuthorized } from "@redhat-cloud-services/frontend-components";
 
import { useTranslation } from 'react-i18next';

export const AccessDenniedPage: React.FunctionComponent = () => {
  const { t } = useTranslation();

  return (<Main>
    <NotAuthorized title={t('accessdenied.accessDeniedTitle')} description={t('accessdenied.accessDeniedDescription')} prevPageButtonText={t('accessdenied.accessDeniedButtonText')} showReturnButton={true}/>
  </Main>
  );
};

export default AccessDenniedPage;