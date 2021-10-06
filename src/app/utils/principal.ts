import { PrincipalApi } from '@redhat-cloud-services/rbac-client';
import { Configuration, SecurityApi } from '@rhoas/kafka-management-sdk';
import { Principal, PrincipalType, Auth, Config } from '@rhoas/app-services-ui-shared';

/**
 * Retrieves the list of user accounts and service accounts using the Principal API.
 * @param auth 
 * @param config 
 */
export const getPrincipals = async (auth: Auth, config: Config, owner?: string) => {
    let principals: Principal[]  = [];
    const accessToken = await auth?.kas.getToken();
    const securityApi = new SecurityApi({
        accessToken,
        basePath: config?.kas.apiBasePath || '',
    } as Configuration);
    const serviceAccounts = await securityApi.getServiceAccounts().then(response => response.data.items.map(sa => {
        return {
        id: sa.client_id,
        displayName: sa.name,
        principalType: PrincipalType.ServiceAccount
        } as Principal;
    }));

    principals = serviceAccounts;

    const principalApi = new PrincipalApi({
        accessToken,
        basePath: config?.rbac.basePath
    });

    const currentlyLoggedInuser = await auth?.getUsername();

    try {
        const userAccounts = await principalApi.listPrincipals(-1).then(response => response.data.data.map(p => {
        return {
            id: p.username,
            principalType: PrincipalType.UserAccount,
            displayName: `${p.first_name} ${p.last_name}`,
            emailAddress: p.email
        } as Principal;
        }).filter(p => (p.id !== currentlyLoggedInuser && p.id !== owner)));
        principals.concat(userAccounts);
    } catch (e) {
        // ignore the error
    }

    return principals;
};
 