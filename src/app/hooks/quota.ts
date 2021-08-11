import { useEffect, useState, useMemo } from 'react';
import { useAuth, useConfig, Quota, QuotaValue, QuotaType, ProductType } from '@bf2/ui-shared';
import { Configuration, DefaultApi } from '@openapi/ams';

export const useQuota = (productId: ProductType) => {
    const config = useConfig();
    const auth = useAuth();

    const [orgId, setOrgId] = useState();

    useEffect(() => {
        const getCurrentAccount = async () => {
            if (!orgId) {
                const accessToken = await auth?.ams.getToken();
                const ams = new DefaultApi({
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

    const getQuota = async () => {
        let filteredQuota: Quota = { loading: true, isServiceDown: false, data: undefined };

        if (orgId) {
            const {
                ams: amsConfig
            } = config || {};
            const { quotaId, trialQuotaId } = amsConfig || {};
            const accessToken = await auth?.ams.getToken();
            const ams = new DefaultApi({
                accessToken,
                basePath: config?.ams.apiBasePath || '',
            } as Configuration);

            await ams
                .apiAccountsMgmtV1OrganizationsOrgIdQuotaCostGet(orgId, undefined, true)
                .then((res) => {
                    const quotaData = new Map<QuotaType, QuotaValue>();
                    const kasQuota = res?.data?.items?.filter(
                        (q) => q.quota_id.trim() === quotaId
                    )[0];

                    const kasTrialQuota = res?.data?.items?.filter(
                        (q) => q.quota_id.trim() === trialQuotaId
                    )[0];

                    if (kasQuota) {
                        quotaData?.set(QuotaType?.kas, {
                            allowed: kasQuota?.allowed,
                            consumed: kasQuota?.consumed,
                            remaining: kasQuota?.allowed - kasQuota?.consumed
                        });
                    }

                    if (kasTrialQuota) {
                        quotaData?.set(QuotaType?.kasTrial, {
                            allowed: kasTrialQuota?.allowed,
                            consumed: kasTrialQuota?.consumed,
                            remaining: kasTrialQuota?.allowed - kasTrialQuota?.consumed
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