import { useCallback, useEffect, useState } from "react";
import {
  useAuth,
  useConfig,
  Quota,
  QuotaValue,
  QuotaType,
  ProductType,
} from "@rhoas/app-services-ui-shared";
import { Configuration, AppServicesApi } from "@rhoas/account-management-sdk";
import { useConstants } from "@app/providers/config/ServiceConstants";

export const useQuota = (productId: ProductType) => {
  const config = useConfig();
  const auth = useAuth();
  const constants = useConstants();

  const [orgId, setOrgId] = useState<string>();

  useEffect(() => {
    const getCurrentAccount = async () => {
      if (!orgId) {
        const accessToken = await auth?.ams.getToken();
        const ams = new AppServicesApi({
          accessToken,
          basePath: config?.ams.apiBasePath || "",
        } as Configuration);

        await ams.apiAccountsMgmtV1CurrentAccountGet().then((account) => {
          const orgID = account?.data?.organization?.id;
          setOrgId(orgID);
        });
      }
    };

    getCurrentAccount();
  }, [config, auth, orgId]);

  const getQuotaTypesByProductId = useCallback(() => {
    const kasQuotaProductId = constants.kafka.ams.quotaProductId;
    const kasTrialQuotaProductId = constants.kafka.ams.trialQuotaProductId;
    const kasResourceName = constants.kafka.ams.resourceName;

    const srsQuotaProductId = constants.serviceRegistry.ams.quotaProductId;
    const srsTrialQuotaProductId =
      constants.serviceRegistry.ams.trialQuotaProductId;
    const srsResourceName = constants.serviceRegistry.ams.resourceName;

    if (productId === ProductType.kas) {
      return {
        quotaProductId: kasQuotaProductId,
        trialQuotaProductId: kasTrialQuotaProductId,
        resourceName: kasResourceName,
        quotaKey: QuotaType.kas,
        trialQuotaKey: QuotaType.kasTrial,
      };
    } else if (productId === ProductType.srs) {
      return {
        quotaProductId: srsQuotaProductId,
        trialQuotaProductId: srsTrialQuotaProductId,
        resourceName: srsResourceName,
        quotaKey: QuotaType.srs,
        trialQuotaKey: QuotaType.srsTrial,
      };
    }
    throw new Error(
      `getQuotaTypesByProductId error, unrecognized productId ${productId}`
    );
  }, [constants, productId]);

  const getQuota = useCallback(async () => {
    const quotaData = new Map<QuotaType, QuotaValue>();
    const filteredQuota: Quota = {
      loading: true,
      isServiceDown: false,
      data: undefined,
    };

    if (orgId) {
      const {
        quotaProductId,
        trialQuotaProductId,
        resourceName,
        quotaKey,
        trialQuotaKey,
      } = getQuotaTypesByProductId() || {};

      const accessToken = await auth?.ams.getToken();
      const ams = new AppServicesApi({
        accessToken,
        basePath: config?.ams.apiBasePath || "",
      } as Configuration);

      try {
        const response =
          await ams.apiAccountsMgmtV1OrganizationsOrgIdQuotaCostGet(
            orgId,
            undefined,
            true
          );

        const quota = response?.data?.items?.find((q) =>
          q.related_resources?.find(
            (r) =>
              r.resource_name === resourceName && r.product === quotaProductId
          )
        );
        const trialQuota = response?.data?.items?.find((q) =>
          q.related_resources?.find(
            (r) =>
              r.resource_name === resourceName &&
              r.product === trialQuotaProductId
          )
        );

        if (quota && quota.allowed > 0) {
          const remaining = quota?.allowed - quota?.consumed;
          quotaData?.set(quotaKey, {
            allowed: quota?.allowed,
            consumed: quota?.consumed,
            remaining: remaining < 0 ? 0 : remaining,
          });
        }

        if (trialQuota) {
          quotaData?.set(trialQuotaKey, {
            allowed: trialQuota?.allowed,
            consumed: trialQuota?.consumed,
            remaining: trialQuota?.allowed - trialQuota?.consumed,
          });
        }

        filteredQuota.loading = false;
        filteredQuota.data = quotaData;
      } catch (error) {
        filteredQuota.loading = false;
        filteredQuota.isServiceDown = true;
        console.error(error);
      }
    }

    return filteredQuota;
  }, [auth, config, getQuotaTypesByProductId, orgId]);

  return { orgId, getQuota };
};
