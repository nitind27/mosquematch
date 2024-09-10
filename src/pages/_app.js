import "@/styles/globals.css";
import "@/styles/home.css";
import "@/styles/responsive.css";
import "@/styles/sign.css";
import "@/styles/create.css";
import "@/styles/results.css";
import "@/styles/messages.css";
import "@/styles/imam.css";
import "@/styles/editProfile.css";
import "@/styles/interest.css";
import "@/styles/admin.css";

import global_en from "./translations/en/global.json";
import global_es from "./translations/es/global.json";
import global_fr from "./translations/fr/global.json";
import global_de from "./translations/de/global.json";
import global_ru from "./translations/ru/global.json";
import global_it from "./translations/it/global.json";
import global_pt from "./translations/pt/global.json";
import global_fi from "./translations/fi/global.json";
import global_nl from "./translations/nl/global.json";
import i18next from "i18next";
import { I18nextProvider } from "react-i18next";
import Backend from "i18next-xhr-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import { SessionProvider } from "next-auth/react";
import { useState, createContext } from "react";
import AppContextProvider from "./Pagess/AppContext";

//Using i18next for translation
i18next
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    interpolation: { escapeValue: false },
    lng: "en", // Setting default language
    resources: {
      en: {
        global: global_en,
      },
      es: {
        global: global_es,
      },
      fr: {
        global: global_fr,
      },
      de: {
        global: global_de,
      },
      ru: {
        global: global_ru,
      },
      it: {
        global: global_it,
      },
      pt: {
        global: global_pt,
      },
      fi: {
        global: global_fi,
      },
      nl: {
        global: global_nl,
      },
    },
  });

export default function App({ Component, pageProps, session }) {
  return (
    <SessionProvider session={session}>
      <AppContextProvider>
        <I18nextProvider i18n={i18next}>
          <Component {...pageProps} />
        </I18nextProvider>
      </AppContextProvider>
    </SessionProvider>
  );
}
