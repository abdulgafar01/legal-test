"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { IntlProvider } from "next-intl";
import { Locale, detectLocale } from "@/i18n";
import enMessagesLanding from "@/messages/en.json";
import arMessagesLanding from "@/messages/ar.json";
import enMessagesSignup from "@/messages/signup/en.json";
import arMessagesSignup from "@/messages/signup/ar.json";

const enMessages = {
  ...enMessagesLanding,
  ...enMessagesSignup,
};

const arMessages = {
  ...arMessagesLanding,
  ...arMessagesSignup,
};
const messagesMap = {
  en: enMessages,
  ar: arMessages,
};

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextType>({
  locale: "en",
  setLocale: () => {},
});

export const useLocale = () => useContext(LocaleContext);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  // Load initial language from cookie or browser
  useEffect(() => {
    const initial = detectLocale();
    setLocaleState(initial);
    applyLanguageDirection(initial);
  }, []);

  const setCookie = (name: string, value: string, days = 365) => {
    const expires = new Date();
    expires.setDate(expires.getDate() + days);
    document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/`;
  };

  const applyLanguageDirection = (lang: Locale) => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  };

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    setCookie("preferred_lang", newLocale);
    applyLanguageDirection(newLocale);
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <IntlProvider
        locale={locale}
        messages={messagesMap[locale]}
        timeZone="UTC"
      >
        {children}
      </IntlProvider>
    </LocaleContext.Provider>
  );
}
