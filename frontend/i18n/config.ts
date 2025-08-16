export type Locale = (typeof locales)[number];

export const locales = ['en', 'my'] as const;
export const defaultLocale: Locale = 'en';