import { useLocation } from 'react-router-dom';
import { parse as parseQueryString, stringifyUrl } from 'query-string';
import { useAsyncTermsReview, ITermsConfig } from '@app/services/termsReview';
import { getTermsAppURL } from '@app/utils/termsApp';

export const useModalControl = (termsConfig: ITermsConfig) => {
    const loadTermsReview = useAsyncTermsReview(termsConfig);
    const location = useLocation();

    const shouldOpenCreateModal = async () => {
        const parsed = parseQueryString(location.search);
        const c = parsed['create'] === 'true';
        if (c) {
            const termsReview = await loadTermsReview();
            if (!termsReview.terms_required) {
                return true;
            }
        }
        return false;
    };

    const preCreateInstance = async (open: boolean) => {
        const termsReview = await loadTermsReview();
        if (termsReview.terms_available || termsReview.terms_required) {
            if (termsReview.redirect_url === undefined) {
                throw new Error('terms must be signed but there is no terms url');
            }
            const redirectURL = stringifyUrl({ url: window.location.href, query: { create: 'true' } });
            const url = getTermsAppURL(termsReview.redirect_url, redirectURL, window.location.href);
            window.location.href = url;
            return false;
        }
        return open;
    };

    return { shouldOpenCreateModal, preCreateInstance };
};