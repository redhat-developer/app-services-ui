import { } from 'react';
import { useConfig } from '@rhoas/app-services-ui-shared';
import { buildTokenEndPointUrl } from "@app/utils";

export const useMASToken = () => {
    const config = useConfig();
    const getTokenEndPointUrl = () => {
        if (config) {
            return buildTokenEndPointUrl(config.masSso.authServerUrl, config.masSso.realm);
        }
        return undefined;
    };

    return { getTokenEndPointUrl };
}
