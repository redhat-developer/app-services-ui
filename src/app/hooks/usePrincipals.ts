import { useEffect, useState } from "react";
import { Configuration, SecurityApi } from "@rhoas/kafka-management-sdk";
import { PrincipalApi } from "@redhat-cloud-services/rbac-client";
import {
  Principal,
  PrincipalType,
  useAuth,
  useConfig,
} from "@rhoas/app-services-ui-shared";

export function usePrincipals(): {
  loading: boolean;
  users: Principal[] | undefined;
  services: Principal[] | undefined;
  allPrincipals: Principal[] | undefined;
} {
  const config = useConfig();
  const auth = useAuth();

  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<Principal[] | undefined>();
  const [users, setUsers] = useState<Principal[] | undefined>();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const accessToken = await auth.kas.getToken();
        const rbacBasePath = config.rbac.basePath;
        const saBasePath = config.kas.apiBasePath;
        if (accessToken) {
          const [usersResult, servicesResult] = await Promise.allSettled([
            fetchUserAccounts(accessToken, rbacBasePath),
            fetchServiceAccounts(accessToken, saBasePath),
          ]);

          if (usersResult.status === "fulfilled") {
            setUsers(usersResult.value);
          }
          if (servicesResult.status === "fulfilled") {
            setServices(servicesResult.value);
          }
        } else {
          console.warn("app-services-ui no access token in usePrincipals");
        }
        setLoading(false);
      } catch {
        setLoading(false);
      }
    })();
  }, [auth, config]);

  return {
    loading,
    users,
    services,
    allPrincipals:
      users || services ? [...(users || []), ...(services || [])] : undefined,
  };
}

async function fetchUserAccounts(accessToken: string, basePath: string) {
  try {
    const principalApi = new PrincipalApi({
      accessToken,
      basePath,
    });

    return await principalApi.listPrincipals(-1).then((response) =>
      response.data.data.map((p) => {
        return {
          id: p.username,
          principalType: PrincipalType.UserAccount,
          displayName: `${p.first_name} ${p.last_name}`,
          emailAddress: p.email,
        } as Principal;
      })
    );
  } catch (e) {
    // temp fix - this API is only available to org admins
    // needs a proper approach longer term
    console.warn("app-services-ui fetchUserAccounts error", e);
  }
  return undefined;
}

async function fetchServiceAccounts(accessToken: string, basePath: string) {
  try {
    const securityApi = new SecurityApi({
      accessToken,
      basePath,
    } as Configuration);
    return await securityApi.getServiceAccounts().then((response) =>
      response.data.items.map((sa) => {
        return {
          id: sa.client_id,
          displayName: sa.name,
          principalType: PrincipalType.ServiceAccount,
        } as Principal;
      })
    );
  } catch (e) {
    console.warn("app-services-ui fetchServiceAccounts error", e);
  }
  return undefined;
}
