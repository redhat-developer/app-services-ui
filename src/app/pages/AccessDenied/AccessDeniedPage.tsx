import React from 'react';

import { Main, NotAuthorized } from '@redhat-cloud-services/frontend-components';

import { useTranslation, Trans } from 'react-i18next';
import { Link } from 'react-router-dom';

interface GetLinkProps {
  href?: string;
}

const GetLink: React.FunctionComponent<GetLinkProps> = ({ href, children }) => <Link to={href || ''}>{children}</Link>;

export const AccessDeniedPage: React.FunctionComponent = () => {
  const { t } = useTranslation();

  const accessDeniedDetails = (
    <Trans
      i18nKey="accessdenied.accessDeniedDescription"
      t={t}
      components={[<GetLink key="kafkas" href="/streams/kafkas" />]}
    />
  );

  return (
    <Main>
      <NotAuthorized
        title={t('accessdenied.accessDeniedTitle')}
        description={accessDeniedDetails}
        prevPageButtonText={t('accessdenied.accessDeniedButtonText')}
        showReturnButton={true}
      />
    </Main>
  );
};
