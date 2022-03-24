import { useEffect, useState, useMemo } from 'react';
import { useAuth, useConfig, Quota, QuotaValue, QuotaType, ProductType } from '@rhoas/app-services-ui-shared';
import { Configuration, AppServicesApi } from '@rhoas/account-management-sdk';
import { useConstants } from '@app/providers/config/ServiceConstants';

export const useQuota = (productId: ProductType) => {
    const config = useConfig();
    const auth = useAuth();
    const constants = useConstants();

    const [orgId, setOrgId] = useState();

    useEffect(() => {
        const getCurrentAccount = async () => {
            if (!orgId) {
                const accessToken = await auth?.ams.getToken();
                const ams = new AppServicesApi({
                    accessToken,
                    basePath: config?.ams.apiBasePath || '',
                } as Configuration);

                await ams.apiAccountsMgmtV1CurrentAccountGet().then((account) => {
                    const orgID = account?.data?.organization?.id;
                    setOrgId(orgID);
                });
            }
        };

        getCurrentAccount();
    }, [config?.ams.apiBasePath, auth]);

    const getQuotaTypesByProductId = () => {
        const kasQuotaProductId = constants.kafka.ams.quotaProductId;
        const kasTrialQuotaProductId = constants.kafka.ams.trialQuotaProductId;
        const kasResourceName = constants.kafka.ams.resourceName;

        const srsQuotaProductId = constants.serviceRegistry.ams.quotaProductId;
        const srsTrialQuotaProductId = constants.serviceRegistry.ams.trialQuotaProductId;
        const srsResourceName = constants.serviceRegistry.ams.resourceName;

        if (productId === ProductType.kas) {
            return { quotaProductId: kasQuotaProductId, trialQuotaProductId: kasTrialQuotaProductId, resourceName: kasResourceName, quotaKey: QuotaType.kas, trialQuotaKey: QuotaType.kasTrial };
        } else if (productId === ProductType.srs) {
            return { quotaProductId: srsQuotaProductId, trialQuotaProductId: srsTrialQuotaProductId, resourceName: srsResourceName, quotaKey: QuotaType.srs, trialQuotaKey: QuotaType.srsTrial };
        }
    }

    const getQuota = async () => {
        let filteredQuota: Quota = { loading: true, isServiceDown: false, data: undefined };

        if (orgId) {
            const { quotaProductId, trialQuotaProductId, resourceName, quotaKey, trialQuotaKey } = getQuotaTypesByProductId() || {};

            const accessToken = await auth?.ams.getToken();
            const ams = new AppServicesApi({
                accessToken,
                basePath: config?.ams.apiBasePath || '',
            } as Configuration);
            await ams
                .apiAccountsMgmtV1OrganizationsOrgIdQuotaCostGet(orgId, undefined, true)
                .then((res) => {
                    const quotaData = new Map<QuotaType, QuotaValue>();
                    const quota = res?.data?.items?.filter(
                        (q) => q.related_resources?.filter((r) => r.resource_name === resourceName && r.product === quotaProductId)[0]
                    )[0];

                    const trialQuota = res?.data?.items?.filter(
                        (q) => q.related_resources?.filter((r) => r.resource_name === resourceName && r.product === trialQuotaProductId)[0]
                    )[0];

                    if (quota && quota.allowed > 0) {
                        const remaining = quota?.allowed - quota?.consumed;
                        quotaData?.set(quotaKey, {
                            allowed: quota?.allowed,
                            consumed: quota?.consumed,
                            remaining: remaining < 0 ? 0 : remaining
                        });
                    }

                    if (trialQuota) {
                        quotaData?.set(trialQuotaKey, {
                            allowed: trialQuota?.allowed,
                            consumed: trialQuota?.consumed,
                            remaining: trialQuota?.allowed - trialQuota?.consumed
                        });
                    }

                    filteredQuota.loading = false;
                    filteredQuota.data = quotaData;
                })
                .catch((error) => {
                    filteredQuota.loading = false;
                    filteredQuota.isServiceDown = true;
                });
        }
        return filteredQuota;
    };

    const contextValue = useMemo(() => {
        return { orgId, getQuota };
    }, [orgId, getQuota]);

    return contextValue;
}

