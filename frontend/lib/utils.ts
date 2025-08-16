import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { useLocale } from 'next-intl';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Extracts the correct language property from an object based on the current locale
 * @param obj - The object containing language-specific properties (e.g., { en: 'English', my: 'Myanmar' })
 * @param locale - The current locale (e.g., 'en' or 'my')
 * @returns The value in the appropriate language or a fallback
 */
export function getLocalizedProperty(obj: any, locale: string, fallbackLocale: string = 'en'): string {
  if (!obj) return '';
  
  // If the object has a property matching the current locale, return it
  if (obj[locale]) {
    return obj[locale];
  }
  
  // If the object has a property matching the fallback locale, return it
  if (obj[fallbackLocale]) {
    return obj[fallbackLocale];
  }
  
  // If the object itself is a string, return it
  if (typeof obj === 'string') {
    return obj;
  }
  
  // Return the first available property or empty string
  const firstKey = Object.keys(obj)[0];
  return firstKey ? obj[firstKey] : '';
}

/**
 * Custom hook to get localized property based on current i18n locale
 * @param obj - The object containing language-specific properties
 * @returns The value in the current language
 */
export function useLocalizedProperty(obj: any): string {
  // Get the current language directly from the i18n instance
  const locale = useLocale();
  return getLocalizedProperty(obj, locale);
}

// utils/isPlantHealthy.ts

interface LocalizedName {
  en: string;
  my: string; // ✅ Burmese (Myanmar)
}

type Name = string | LocalizedName;

export function isPlantHealthy(primaryDetection: { name: Name }): boolean {
  const name = primaryDetection.name;

  // Extract display name as string
  const displayName = typeof name === 'string'
    ? name
    : (name.en || name.my || '').trim();

  if (!displayName) return false;

  const lowerName = displayName.toLowerCase();

  // 🔤 Keywords in English
  const englishKeywords = ['healthy', 'health', 'background', 'normal', 'good'];

  // 🔤 Keywords in Burmese (Myanmar) – in Burmese script
  const burmeseKeywords = [
    'ကျန်းမာသော',   // "healthy" (adj)
    'နောက်ခံ',       // "background"
    'ပုံမှန်',        // "normal"
    'ကောင်း',         // "good"
    'ကျန်းမာ',       // "health"
  ];

  // Combine all keywords
  const allKeywords = [...englishKeywords, ...burmeseKeywords];

  // Check if any keyword is included in the name
  return allKeywords.some(keyword => {
    // For English: use word boundaries to avoid false positives (e.g., "unhealthy")
    if (englishKeywords.includes(keyword)) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'i');
      return regex.test(lowerName);
    }
    // For Burmese: simple includes (no word boundaries in Unicode)
    return lowerName.includes(keyword.toLowerCase());
  });
}