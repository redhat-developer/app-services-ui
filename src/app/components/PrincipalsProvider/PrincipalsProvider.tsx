import React, { useEffect, useState } from "react";
import { Configuration, KafkaRequest, SecurityApi } from "@rhoas/kafka-management-sdk";
import { Principal, Principals, PrincipalsContext, PrincipalType, useAuth, useConfig } from "@bf2/ui-shared";
import { PrincipalApi } from "@redhat-cloud-services/rbac-client";

export type PrincipalsProviderProps = {
  kafkaInstance?: KafkaRequest
}

export const PrincipalsProvider: React.FunctionComponent<PrincipalsProviderProps> = ({
                                                                                       children,
                                                                                       kafkaInstance
                                                                                     }) => {

  const config = useConfig();
  const auth = useAuth();

  const [serviceAccountPrincipals, setServiceAccountPrincipals] = useState<Principal[] | undefined>();
  const [userAcountPrincipals, setUserAccountPrincipals] = useState<Principal[] | undefined>();

  useEffect(() => {
    const fetchUserAccounts = async () => {
      if (config !== undefined && auth !== undefined && config.rbac.basePath !== undefined && kafkaInstance !== undefined) {
        const accessToken = await auth.kas.getToken();
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
          }).filter(p => (p.id !== currentlyLoggedInuser && p.id !== kafkaInstance?.owner)));
          setUserAccountPrincipals(userAccounts);
        } catch (e) {
          // temp fix - this API is only available to org admins
          // needs a proper approach longer term
        }
      }
    }
    fetchUserAccounts();
  }, [auth, config, kafkaInstance]);

  useEffect(() => {
    const fetchServiceAccounts = async () => {
      if (config !== undefined && auth !== undefined && config.rbac.basePath !== undefined && kafkaInstance !== undefined) {
        const accessToken = await auth.kas.getToken();
        const securityApi = new SecurityApi({
          accessToken,
          basePath: config.kas.apiBasePath,
        } as Configuration);
        const serviceAccounts = await securityApi.getServiceAccounts().then(response => response.data.items.map(sa => {
          return {
            id: sa.client_id,
            displayName: sa.name,
            principalType: PrincipalType.ServiceAccount
          } as Principal;
        }));

        setServiceAccountPrincipals(serviceAccounts);
      }
    }
    fetchServiceAccounts();
  }, [auth, config, kafkaInstance]);

  const value =
    serviceAccountPrincipals ? {
      getAllPrincipals: () => {
        let answer: Principal[] = [];
        if (userAcountPrincipals !== undefined) {
          answer = answer.concat(userAcountPrincipals);
        }
        if (serviceAccountPrincipals !== undefined) {
          answer = answer.concat(serviceAccountPrincipals);
        }
        return answer;
      }
    } as Principals : undefined;

  return (
    <PrincipalsContext.Provider value={value}>
      {children}
    </PrincipalsContext.Provider>
  );
}
