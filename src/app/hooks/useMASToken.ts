import { } from 'react';
import { useConfig } from '@rhoas/app-services-ui-shared';

export const useMASToken = () => {
    const config = useConfig();
    const getTokenEndPointUrl = () => {
        if (config) {
            return `${config.masSso.authServerUrl}/realms/${config.masSso.realm}/protocol/openid-connect/token`;
        }
        return undefined;
    };

    return { getTokenEndPointUrl };
}