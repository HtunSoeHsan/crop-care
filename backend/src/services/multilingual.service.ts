import { PlantDisease, PlantCareGuide } from '../types';

export class MultilingualService {
  /**
   * Process disease data to ensure proper multilingual structure
   * @param data - Raw disease data
   * @returns Processed disease data with proper multilingual structure
   */
  static processDiseaseData(data: any): PlantDisease {
    return {
      classIndex: data.classIndex,
      name: data.name,                    // Can be "Early Blight" or { en: "Early Blight", my: "..." }
      description: data.description,      // Can be string or multilingual object
      symptoms: data.symptoms || [],      // Array of strings or multilingual objects
      plantType: data.plantType,         // Can be string or multilingual object
      treatments: data.treatments || [],  // Array of treatment objects
      prevention: data.prevention || [],
      recommendations: data.recommendations || [],
      detection: data.detection,
      preventionTips: data.preventionTips || []
    };
  }

  /**
   * Process plant care guide data to ensure proper multilingual structure
   * @param data - Raw plant care guide data
   * @returns Processed plant care guide data with proper multilingual structure
   */
  static processPlantCareGuideData(data: any): PlantCareGuide {
    return {
      plantName: data.plantName,         // Can be string or multilingual object
      scientificName: data.scientificName,
      plantType: data.plantType,         // Can be string or multilingual object
      description: data.description,     // Can be string or multilingual object
      images: data.images || [],
      careInstructions: {
        watering: {
          frequency: data.careInstructions?.watering?.frequency || 'Weekly',
          amount: data.careInstructions?.watering?.amount || 'Moderate',
          tips: data.careInstructions?.watering?.tips || []
        },
        sunlight: {
          requirement: data.careInstructions?.sunlight?.requirement || 'Partial',
          hours: data.careInstructions?.sunlight?.hours || '4-6 hours',
          tips: data.careInstructions?.sunlight?.tips || []
        },
        soil: {
          type: data.careInstructions?.soil?.type || 'Well-draining',
          pH: data.careInstructions?.soil?.pH || '6.0-7.0',
          drainage: data.careInstructions?.soil?.drainage || 'Good',
          tips: data.careInstructions?.soil?.tips || []
        },
        fertilizing: {
          frequency: data.careInstructions?.fertilizing?.frequency || 'Monthly',
          type: data.careInstructions?.fertilizing?.type || 'Balanced',
          tips: data.careInstructions?.fertilizing?.tips || []
        }
      }
    };
  }

  /**
   * Get localized content from a document
   * @param document - Document containing multilingual fields
   * @param language - Preferred language ('en' or 'my')
   * @returns Document with localized content
   */
  static getLocalizedContent(document: any, language: 'en' | 'my' = 'en') {
    const localized = { ...document };
    
    // Helper function to localize a field
    const localizeField = (obj: any) => {
      if (obj && typeof obj === 'object') {
        if (obj.en && obj.my) {
          return obj[language] || obj.en; // Return preferred language or fallback to English
        }
      }
      return obj; // Return as-is if not multilingual
    };
    
    // Localize all multilingual fields
    Object.keys(localized).forEach(key => {
      if (typeof localized[key] === 'object' && localized[key] !== null) {
        if (Array.isArray(localized[key])) {
          // Handle arrays
          localized[key] = localized[key].map((item: any) => {
            if (typeof item === 'object' && item !== null) {
              return localizeField(item);
            }
            return item;
          });
        } else {
          // Handle objects
          localized[key] = localizeField(localized[key]);
        }
      }
    });
    
    return localized;
  }

  /**
   * Search diseases with multilingual support
   * @param query - Search query
   * @param language - Preferred language ('en' or 'my')
   * @returns Search results
   */
  static async searchDiseases(query: string, language: 'en' | 'my' = 'en') {
    // This would typically query the database
    // For now, return a mock result
    const fallbackLang = language === 'en' ? 'my' : 'en';
    
    return {
      query,
      language,
      fallbackLang,
      results: []
    };
  }

  /**
   * Search plant care guides with multilingual support
   * @param query - Search query
   * @param language - Preferred language ('en' or 'my')
   * @param filters - Additional filters
   * @returns Search results
   */
  static async searchPlantGuides(query: string, language: 'en' | 'my' = 'en', filters: any = {}) {
    // This would typically query the database
    // For now, return a mock result
    const fallbackLang = language === 'en' ? 'my' : 'en';
    
    return {
      query,
      language,
      fallbackLang,
      filters,
      results: []
    };
  }

  /**
   * Update multilingual fields in a document
   * @param document - Document to update
   * @param field - Field name to update
   * @param translations - Translations object with en and my properties
   * @returns Updated document
   */
  static updateMultilingualField(document: any, field: string, translations: { en?: string; my?: string }) {
    const updated = { ...document };
    
    if (!updated[field]) {
      updated[field] = {};
    }
    
    // Update English translation
    if (translations.en) {
      updated[field].en = translations.en;
    }
    
    // Update Malay translation
    if (translations.my) {
      updated[field].my = translations.my;
    }
    
    return updated;
  }

  /**
   * Update multiple multilingual fields at once
   * @param document - Document to update
   * @param updates - Object with field names and their translations
   * @returns Updated document
   */
  static updateMultipleMultilingualFields(document: any, updates: { [field: string]: { en?: string; my?: string } }) {
    let updated = { ...document };
    
    Object.keys(updates).forEach(field => {
      const currentValue = updated[field];
      const translations = updates[field];
      
      if (!updated[field]) {
        updated[field] = {};
      }
      
      // Update English translation
      if (translations.en) {
        updated[field].en = translations.en;
      }
      
      // Update Malay translation
      if (translations.my) {
        updated[field].my = translations.my || (typeof currentValue === 'string' ? currentValue : currentValue?.my);
      }
    });
    
    return updated;
  }

  /**
   * Validate multilingual text structure
   * @param text - Text to validate
   * @returns Validation result
   */
  static validateMultilingualText(text: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (typeof text === 'string') {
      if (text.trim().length === 0) {
        errors.push('Text cannot be empty');
      }
    } else if (typeof text === 'object' && text !== null) {
      if (!text.en || typeof text.en !== 'string' || text.en.trim().length === 0) {
        errors.push('en is required and cannot be empty');
      }
      if (!text.my || typeof text.my !== 'string' || text.my.trim().length === 0) {
        errors.push('my is required and cannot be empty');
      }
    } else {
      errors.push('Text must be a string or object with en and my properties');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Create database query for multilingual search
   * @param query - Search query
   * @param language - Preferred language
   * @returns MongoDB query object
   */
  static createMultilingualSearchQuery(query: string, language: 'en' | 'my' = 'en') {
    const fallbackLang = language === 'en' ? 'my' : 'en';
    
    return {
      $or: [
        // Search in preferred language
        { [`name.${language}`]: { $regex: query, $options: 'i' } },
        { [`description.${language}`]: { $regex: query, $options: 'i' } },
        // Fallback to other language
        { [`name.${fallbackLang}`]: { $regex: query, $options: 'i' } },
        { [`description.${fallbackLang}`]: { $regex: query, $options: 'i' } }
      ]
    };
  }

  /**
   * Create database query for multilingual field validation
   * @returns MongoDB query object for validation
   */
  static createMultilingualValidationQuery() {
    return {
      'name.my': { $exists: true, $ne: null },
      $expr: { $ne: ['$name.en', '$name.my'] }
    };
  }
}
