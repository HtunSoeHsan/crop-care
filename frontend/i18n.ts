import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  // Validate locale
  const validLocales = ['en', 'my'];
  const resolvedLocale = locale && validLocales.includes(locale) ? locale : 'en'; // Fallback to 'en' or your default locale
  
  try {
    const messages = (await import(`./messages/${resolvedLocale}.json`)).default;
    return {
      locale: resolvedLocale,
      messages
    };
  } catch (error) {
    // Fallback to English if locale file is not found
    const messages = (await import(`./messages/en.json`)).default;
    return {
      locale: 'en',
      messages
    };
  }
});