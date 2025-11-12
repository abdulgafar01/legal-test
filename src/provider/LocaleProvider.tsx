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
import enLogin from "@/messages/login/en.json";
import arLogin from "@/messages/login/ar.json";
import enVerifyPhone from "@/messages/verifyPhone/en.json";
import arVerifyPhone from "@/messages/verifyPhone/ar.json";
import enSettingsSeeker from "@/messages/dashboard/settings-seeker/en.json";
import arSettingsSeeker from "@/messages/dashboard/settings-seeker/ar.json";
import enDashboard from "@/messages/dashboard/en.json";
import arDashboard from "@/messages/dashboard/ar.json";
import enChat from "@/messages/dashboard/chat/en.json";
import arChat from "@/messages/dashboard/chat/ar.json";
import enProfile from "@/messages/dashboard/profile/en.json";
import arProfile from "@/messages/dashboard/profile/ar.json";
import enPrivacy from "@/messages/privacy/en.json";
import arPrivacy from "@/messages/privacy/ar.json";
import enTerms from "@/messages/terms/en.json";
import arTerms from "@/messages/terms/ar.json";
import enMeetings from "@/messages/meeting/en.json";
import arMeetings from "@/messages/meeting/ar.json";
import enSubscriptions from "@/messages/dashboard/subscription/en.json";
import arSubscriptions from "@/messages/dashboard/subscription/ar.json";
import enContact from "@/messages/enContact.json";
import arContact from "@/messages/arContact.json";
import enConsultation from "@/messages/dashboard/consultation/en.json";
import arConsultation from "@/messages/dashboard/consultation/ar.json";
import enVerifyEmail from "@/messages/verifyEmail/en.json";
import arVerifyEmail from "@/messages/verifyEmail/ar.json";
import enPending from "@/messages/enPending.json";
import arPending from "@/messages/arPending.json";
import enAccount from "@/messages/dashboard/profile/account-setup/en.json";
import arAccount from "@/messages/dashboard/profile/account-setup/ar.json";

const enMessages = {
  ...enMessagesLanding,
  ...enMessagesSignup,
  ...enLogin,
  ...enVerifyPhone,
  ...enSettingsSeeker,
  ...enDashboard,
  ...enChat,
  ...enProfile,
  ...enPrivacy,
  ...enTerms,
  ...enMeetings,
  ...enSubscriptions,
  ...enContact,
  ...enConsultation,
  ...enVerifyEmail,
  ...enPending,
  ...enAccount
};

const arMessages = {
  ...arMessagesLanding,
  ...arMessagesSignup,
  ...arLogin,
  ...arVerifyPhone,
  ...arSettingsSeeker,
  ...arDashboard,
  ...arChat,
  ...arProfile,
  ...arPrivacy,
  ...arTerms,
  ...arMeetings,
  ...arSubscriptions,
  ...arContact,
  ...arConsultation,
  ...arVerifyEmail,
  ...arPending,
  ...arAccount
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
  locale: "ar",
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
