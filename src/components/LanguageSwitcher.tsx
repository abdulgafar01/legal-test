"use client";

import { useLocale } from "@/components/LocaleProvider";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
      <select
      value={locale}
      onChange={(e) => setLocale(e.target.value as "en" | "ar")}
      className="border rounded px-2 py-1 text-sm"
    >
      <option value="en">English</option>
      <option value="ar">العربية</option>
    </select>
  );
}
