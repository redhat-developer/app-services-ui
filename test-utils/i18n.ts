import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../src/app/kas-ui-dont-modify-temporay.json";

i18n.use(initReactI18next).init({
  lng: "en",
  fallbackLng: "en",
  ns: ["translations"],
  defaultNS: "translations",
  debug: true,
  interpolation: {
    escapeValue: false, // not needed for react!!
  },
  resources: {
    en: {
      translations: {
        ...en,
      },
    },
  },
});

export default i18n;
