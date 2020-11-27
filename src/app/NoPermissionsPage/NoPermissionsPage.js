import React from 'react';

import { Main, NotAuthorized } from '@redhat-cloud-services/frontend-components';

const NoPermissionsPage = () => {
    return (
        <Main>
            <NotAuthorized serviceName='Sample app'/>
        </Main>
    );
};

export default NoPermissionsPage;
