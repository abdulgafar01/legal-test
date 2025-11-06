"use client";

import { useLocale } from "@/provider/LocaleProvider";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  const toggleLocale = () => {
    setLocale(locale === "en" ? "ar" : "en");
  };

  return (
    <button
      onClick={toggleLocale}
      className="px-3 py-1 rounded-md border text-sm bg-amber-200 shadow-sm hover:bg-amber-100 transition cursor-pointer"
    >
      {locale === "en" ? "العربية" : "en"}
    </button>
  );
}
