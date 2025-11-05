import { cookies, headers } from "next/headers";
import { defaultLocale, languages, Locale } from "@/i18n";

export async function getUserLocale(): Promise<Locale> {
  const cookieStore = await cookies(); 
  const userLang = cookieStore.get("preferred_lang")?.value;

  if (userLang && languages.includes(userLang as Locale)) {
    return userLang as Locale;
  }

  // Detect from browser header
  const headerStore = await headers(); 
  const acceptLang = headerStore.get("accept-language");
  if (acceptLang?.toLowerCase().includes("ar")) return "ar";

  return defaultLocale;
}
