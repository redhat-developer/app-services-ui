import { useEffect, useState, useMemo } from 'react';
import { useAuth, useConfig, Quota, QuotaValue, QuotaType, ProductType } from '@rhoas/app-services-ui-shared';
import { Configuration, RhoasApi } from '@rhoas/account-management-sdk';
import { useConstants } from '@app/providers/config/ServiceConstants';

export const useQuota = (productId: ProductType) => {
    const config = useConfig();
    const auth = useAuth();
    const constants =  useConstants();

    const [orgId, setOrgId] = useState();

    useEffect(() => {
        const getCurrentAccount = async () => {
            if (!orgId) {
                const accessToken = await auth?.ams.getToken();
                const ams = new RhoasApi({
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
        const kasQuotaId = constants.kafka.ams.instanceQuotaId
        const kasTrialQuotaId  =  constants.kafka.ams.trialQuotaId
        const srsQuotaId = constants.serviceRegistry.ams.instanceQuotaId
        const srsTrialQuotaId  =  constants.serviceRegistry.ams.trialQuotaId
        if (productId === ProductType.kas) {
            return { quotaId: kasQuotaId, trialQuotaId: kasTrialQuotaId, quotaKey: QuotaType.kas, trialQuotaKey: QuotaType.kasTrial };
        } else if (productId === ProductType.srs) {
            return { quotaId: srsQuotaId, trialQuotaId: srsTrialQuotaId, quotaKey: QuotaType.srs, trialQuotaKey: QuotaType.srsTrial };
        }
    }

    const getQuota = async () => {
        let filteredQuota: Quota = { loading: true, isServiceDown: false, data: undefined };

        if (orgId) {
            const { quotaId, trialQuotaId, quotaKey, trialQuotaKey } = getQuotaTypesByProductId() || {};

            const accessToken = await auth?.ams.getToken();
            const ams = new DefaultApi({
                accessToken,
                basePath: config?.ams.apiBasePath || '',
            } as Configuration);

            await ams
                .apiAccountsMgmtV1OrganizationsOrgIdQuotaCostGet(orgId, undefined, true)
                .then((res) => {
                    const quotaData = new Map<QuotaType, QuotaValue>();
                    const quota = res?.data?.items?.filter(
                        (q) => q.quota_id.trim() === quotaId
                    )[0];

                    const trialQuota = res?.data?.items?.filter(
                        (q) => q.quota_id.trim() === trialQuotaId
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

