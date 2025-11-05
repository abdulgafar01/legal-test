"use client";

import { useLocale } from "@/components/LocaleProvider";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <button
      onClick={() => setLocale(locale === "en" ? "ar" : "en")}
      className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 transition"
    >
      {locale === "en" ? "العربية" : "English"}
    </button>
  );
}
