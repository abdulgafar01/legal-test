export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export function detectLocale(): Locale {
  // Check cookie
  if (typeof document !== "undefined") {
    const match = document.cookie.match(/(?:^|;\s*)preferred_lang=([^;]+)/);
    if (match) return match[1] as Locale;
  }

  // Check browser language
  if (typeof navigator !== "undefined") {
    const lang = navigator.language.split("-")[0];
    if (lang === "ar") return "ar";
  }

  return defaultLocale;
}
