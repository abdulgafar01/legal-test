export const languages = ['en', 'ar'] as const;
export type Locale = (typeof languages)[number];
export const defaultLocale: Locale = 'en';

export async function getMessages(locale: Locale) {
  const messages = (await import(`./messages/${locale}.json`)).default;
  return messages;
}
