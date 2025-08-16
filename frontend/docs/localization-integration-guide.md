# Frontend Localization Integration Guide

This guide explains how to integrate multilingual API responses with the frontend localization system in the Ayar Care application.

## Overview

The Ayar Care application supports bilingual functionality with English (en) and Myanmar (mm) languages. The backend provides all text content in a multilingual format, and the frontend uses Next.js internationalization with helper utilities to display the appropriate language content.

## Multilingual Data Structure

All text content from the API follows this structure:

```typescript
interface MultilingualText {
  en: string;  // English text
  mm: string;  // Myanmar text
}
```

## Frontend Localization Utilities

The frontend provides utilities in `lib/utils.ts` to handle multilingual content:

### `getLocalizedProperty(property, locale)`

Extracts the appropriate language text from a multilingual object.

```typescript
// Example usage
import { getLocalizedProperty } from '@/lib/utils';
import { useLocale } from 'next-intl';

const locale = useLocale(); // Gets current locale (en or mm)
const diseaseName = getLocalizedProperty(disease.name, locale);
```

### `useLocalizedProperty(property)`

React hook that automatically gets the localized text based on current locale.

```typescript
// Example usage
import { useLocalizedProperty } from '@/lib/utils';

const PlantCard = ({ plant }) => {
  const localizedName = useLocalizedProperty(plant.name);
  
  return <h3>{localizedName}</h3>;
};
```

## API Integration Examples

### Disease Detection Results

When receiving disease detection results from the API:

```typescript
// API Response Structure
interface DiseaseResult {
  status: 'healthy' | 'diseased';
  disease?: {
    name: MultilingualText;
    description: MultilingualText;
    cause: MultilingualText;
    symptoms: MultilingualText[];
    treatment: {
      organic: MultilingualText[];
      conventional: MultilingualText[];
    };
    prevention: MultilingualText[];
    medicine?: {
      organic: Medicine[];
      conventional: Medicine[];
    };
  };
  confidence: number;
  // ... other fields
}

// Frontend Usage
const ScanResults = ({ results }) => {
  const locale = useLocale();
  
  if (results.disease) {
    return (
      <div>
        <h2>{getLocalizedProperty(results.disease.name, locale)}</h2>
        <p>{getLocalizedProperty(results.disease.description, locale)}</p>
        
        <h3>Symptoms:</h3>
        <ul>
          {results.disease.symptoms.map((symptom, index) => (
            <li key={index}>
              {getLocalizedProperty(symptom, locale)}
            </li>
          ))}
        </ul>
        
        <h3>Treatment:</h3>
        <h4>Organic:</h4>
        <ul>
          {results.disease.treatment.organic.map((treatment, index) => (
            <li key={index}>
              {getLocalizedProperty(treatment, locale)}
            </li>
          ))}
        </ul>
      </div>
    );
  }
  
  return <div>Plant is healthy!</div>;
};
```

### Plant Care Guides

When displaying plant care guides:

```typescript
// API Response Structure
interface PlantCareGuide {
  id: string;
  plant_name: MultilingualText;
  plant_type: MultilingualText;
  description: MultilingualText;
  care_instructions: {
    watering: MultilingualText;
    sunlight: MultilingualText;
    soil: MultilingualText;
    // ... other care instructions
  };
  common_problems: {
    name: MultilingualText;
    symptoms: MultilingualText[];
    solutions: MultilingualText[];
  }[];
  // ... other fields
}

// Frontend Usage
const PlantCareGuide = ({ guide }) => {
  const locale = useLocale();
  
  return (
    <div>
      <h1>{getLocalizedProperty(guide.plant_name, locale)}</h1>
      <p><strong>Type:</strong> {getLocalizedProperty(guide.plant_type, locale)}</p>
      <p>{getLocalizedProperty(guide.description, locale)}</p>
      
      <section>
        <h2>Care Instructions</h2>
        <div>
          <h3>Watering</h3>
          <p>{getLocalizedProperty(guide.care_instructions.watering, locale)}</p>
        </div>
        <div>
          <h3>Sunlight</h3>
          <p>{getLocalizedProperty(guide.care_instructions.sunlight, locale)}</p>
        </div>
      </section>
      
      <section>
        <h2>Common Problems</h2>
        {guide.common_problems.map((problem, index) => (
          <div key={index}>
            <h3>{getLocalizedProperty(problem.name, locale)}</h3>
            <h4>Symptoms:</h4>
            <ul>
              {problem.symptoms.map((symptom, symptomIndex) => (
                <li key={symptomIndex}>
                  {getLocalizedProperty(symptom, locale)}
                </li>
              ))}
            </ul>
            <h4>Solutions:</h4>
            <ul>
              {problem.solutions.map((solution, solutionIndex) => (
                <li key={solutionIndex}>
                  {getLocalizedProperty(solution, locale)}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </div>
  );
};
```

### Medicine Information

When displaying medicine recommendations:

```typescript
// Medicine structure with multilingual fields
interface Medicine {
  name: MultilingualText;
  active_ingredient: MultilingualText;
  application: MultilingualText;
  frequency: MultilingualText;
  precautions: MultilingualText;
  waiting_period: MultilingualText;
  expiry: MultilingualText;
  avoid: MultilingualText;
  image: string;
}

// Frontend Usage
const MedicineCard = ({ medicine }) => {
  const locale = useLocale();
  
  return (
    <div className="medicine-card">
      <img src={medicine.image} alt={getLocalizedProperty(medicine.name, locale)} />
      <h3>{getLocalizedProperty(medicine.name, locale)}</h3>
      <p>
        <strong>Active Ingredient:</strong> 
        {getLocalizedProperty(medicine.active_ingredient, locale)}
      </p>
      <p>
        <strong>Application:</strong> 
        {getLocalizedProperty(medicine.application, locale)}
      </p>
      <p>
        <strong>Frequency:</strong> 
        {getLocalizedProperty(medicine.frequency, locale)}
      </p>
      <div className="warning">
        <strong>Precautions:</strong> 
        {getLocalizedProperty(medicine.precautions, locale)}
      </div>
      <div className="danger">
        <strong>Avoid:</strong> 
        {getLocalizedProperty(medicine.avoid, locale)}
      </div>
    </div>
  );
};
```

## Best Practices

### 1. Always Use Localization Utilities
Never access multilingual properties directly. Always use `getLocalizedProperty()` or `useLocalizedProperty()`.

```typescript
// ❌ Don't do this
const diseaseName = disease.name.en; // Hard-coded to English

// ✅ Do this
const diseaseName = getLocalizedProperty(disease.name, locale);
```

### 2. Handle Missing Translations Gracefully
The utilities automatically fall back to English if a translation is missing, but you can add additional fallback logic:

```typescript
const getLocalizedPropertyWithFallback = (property, locale, fallback = 'N/A') => {
  if (!property) return fallback;
  return getLocalizedProperty(property, locale) || fallback;
};
```

### 3. Use TypeScript for Type Safety
Import and use the proper interfaces to ensure type safety:

```typescript
import { DiseaseResult, PlantCareGuide, MultilingualText } from '@/lib/api-service';

// This ensures you're working with the correct data structure
const handleApiResponse = (result: DiseaseResult) => {
  // TypeScript will catch errors if you try to access non-existent properties
};
```

### 4. Consistent Error Handling
When API calls fail, provide localized error messages:

```typescript
const [error, setError] = useState<string | null>(null);
const t = useTranslations('errors'); // Use translation keys for errors

try {
  const result = await ApiService.scanPlant(imageFile);
  // Handle success
} catch (error: any) {
  setError(t('scanFailed')); // Use localized error message
}
```

### 5. Loading States
Show appropriate loading messages based on current locale:

```typescript
const t = useTranslations('common');

if (isLoading) {
  return <div>{t('loading')}</div>; // Localized loading message
}
```

## Testing Localization

### 1. Switch Languages During Development
Test both English and Myanmar content by switching the locale in your browser or using the language switcher component.

### 2. Test Missing Translations
Temporarily remove translations to ensure fallbacks work correctly.

### 3. Test Long Text Content
Ensure UI components handle both short English text and potentially longer Myanmar text gracefully.

## Common Issues and Solutions

### Issue 1: Component Not Re-rendering on Language Change
**Solution:** Ensure you're using the Next.js internationalization hooks properly and that components are re-rendering when locale changes.

### Issue 2: API Data Not Displaying
**Solution:** Check that the API is returning data in the expected multilingual format and that you're using the localization utilities correctly.

### Issue 3: Layout Breaking with Different Languages
**Solution:** Use responsive design and test with both languages to ensure text fits properly in all UI components.

## Conclusion

By following this integration guide, you can ensure that all multilingual content from the API is properly displayed based on the user's selected language. The key is to consistently use the provided localization utilities and maintain type safety throughout your components.

Remember to test thoroughly with both languages and consider the user experience when switching between English and Myanmar content.
