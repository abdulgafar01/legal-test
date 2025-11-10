"use client";

import { useLocale } from "@/provider/LocaleProvider";

export default function LanguageSwitcher({
  isAbsolute = false,
}: {
  isAbsolute?: boolean;
}) {
  const { locale, setLocale } = useLocale();

  const toggleLocale = () => {
    setLocale(locale === "en" ? "ar" : "en");
  };

  return (
    <button
      onClick={toggleLocale}
      className={`px-3 py-1 rounded-md border text-sm bg-amber-200 shadow-sm hover:bg-amber-100 transition cursor-pointer inline ${
        isAbsolute ? "absolute top-2 left-2 z-1000" : ""
      }`}
    >
      {locale === "en" ? "العربية" : "English"}
    </button>
  );
}
