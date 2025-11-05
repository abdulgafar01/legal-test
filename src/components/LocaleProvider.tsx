"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { IntlProvider } from "next-intl";
import { Locale } from "@/i18n";

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextType>({
  locale: "en",
  setLocale: () => {},
});

export const useLocale = () => useContext(LocaleContext);

export function LocaleProvider({
  initialLocale,
  messages,
  children,
}: {
  initialLocale: Locale;
  messages: Record<string, string>;
  children: ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const setCookie = (name: string, value: string, days = 365) => {
  const expires = new Date();
  expires.setDate(expires.getDate() + days);
  document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/`;
};


  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    setCookie("preferred_lang", newLocale);
    document.documentElement.dir = newLocale === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = newLocale;
  };

  useEffect(() => {
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <IntlProvider locale={locale} messages={messages}>
        {children}
      </IntlProvider>
    </LocaleContext.Provider>
  );
}
