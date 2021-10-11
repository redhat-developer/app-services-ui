import React, { useEffect, useState } from 'react';
import { Configuration, KafkaRequest, SecurityApi } from '@rhoas/kafka-management-sdk';
import {
  Principal,
  Principals,
  PrincipalsContext,
  PrincipalType,
  useAuth,
  useConfig,
} from '@rhoas/app-services-ui-shared';
import { PrincipalApi } from '@redhat-cloud-services/rbac-client';

export type PrincipalsProviderProps = {
  kafkaInstance?: KafkaRequest;
};

export const usePrincipal = (instanceOwner: string | undefined) => {
  const config = useConfig();
  const auth = useAuth();

  const [serviceAccountPrincipals, setServiceAccountPrincipals] = useState<Principal[] | undefined>();
  const [userAcountPrincipals, setUserAccountPrincipals] = useState<Principal[] | undefined>();

  useEffect(() => {
    const fetchUserAccounts = async () => {
      if (
        config !== undefined &&
        auth !== undefined &&
        config.rbac.basePath !== undefined &&
        instanceOwner !== undefined
      ) {
        const accessToken = await auth.kas.getToken();
        const principalApi = new PrincipalApi({
          accessToken,
          basePath: config?.rbac.basePath,
        });

        const currentlyLoggedInuser = await auth?.getUsername();

        try {
          const userAccounts = await principalApi.listPrincipals(-1).then((response) =>
            response.data.data
              .map((p) => {
                return {
                  id: p.username,
                  principalType: PrincipalType.UserAccount,
                  displayName: `${p.first_name} ${p.last_name}`,
                  emailAddress: p.email,
                } as Principal;
              })
              .filter((p) => p.id !== currentlyLoggedInuser && p.id !== instanceOwner)
          );
          setUserAccountPrincipals(userAccounts);
        } catch (e) {
          // temp fix - this API is only available to org admins
          // needs a proper approach longer term
        }
      }
    };
    fetchUserAccounts();
  }, [auth, config, instanceOwner]);

  useEffect(() => {
    const fetchServiceAccounts = async () => {
      if (
        config !== undefined &&
        auth !== undefined &&
        config.rbac.basePath !== undefined &&
        instanceOwner !== undefined
      ) {
        const accessToken = await auth.kas.getToken();
        const securityApi = new SecurityApi({
          accessToken,
          basePath: config.kas.apiBasePath,
        } as Configuration);
        const serviceAccounts = await securityApi.getServiceAccounts().then((response) =>
          response.data.items.map((sa) => {
            return {
              id: sa.client_id,
              displayName: sa.name,
              principalType: PrincipalType.ServiceAccount,
            } as Principal;
          })
        );

        setServiceAccountPrincipals(serviceAccounts);
      }
    };
    fetchServiceAccounts();
  }, [auth, config, instanceOwner]);

  const value = {
    getAllPrincipals: () => {
      let answer: Principal[] = [];
      if (userAcountPrincipals !== undefined && serviceAccountPrincipals !== undefined) {
        answer = answer.concat(userAcountPrincipals);
      }
      if (serviceAccountPrincipals !== undefined) {
        answer = answer.concat(serviceAccountPrincipals);
      }
      return answer;
    },
    getAllUserAccounts: () => {
      return userAcountPrincipals;
    },
    getAllServiceAccounts: () => {
      return serviceAccountPrincipals;
    },
  };

  return value;
};

export const PrincipalsProvider: React.FunctionComponent<PrincipalsProviderProps> = ({ children, kafkaInstance }) => {
  const value = usePrincipal(kafkaInstance?.owner);
  return <PrincipalsContext.Provider value={value}>{children}</PrincipalsContext.Provider>;
};
