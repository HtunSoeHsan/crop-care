# 🌍 Localization Integration Guide for Ayar-Care Frontend

## Overview

The Ayar-Care backend now fully supports multilingual content for seamless English and Myanmar language switching in the frontend. This guide explains how to integrate the multilingual API responses with your frontend localization system.

## 🔧 Backend Data Structure

### Multilingual Response Format

All multilingual content from the API follows this structure:
```json
{
  "fieldName": {
    "en": "English content",
    "mm": "Myanmar content"
  }
}
```

### Supported Languages
- `en`: English (default)
- `mm`: Myanmar (မြန်မာ)

## 🔍 Disease Detection Multilingual Response

The disease detection endpoint now returns multilingual content:

```json
{
  "status": "success",
  "data": [
    {
      "classIndex": 0,
      "name": {
        "en": "Tomato Early Blight",
        "mm": "ခရမ်းချဉ်သီး အစောပိုး ရောဂါ"
      },
      "description": {
        "en": "A common fungal disease affecting tomato plants...",
        "mm": "ခရမ်းချဉ်သီးပင်များကို ထိခိုက်စေသော သာမန်မှိုရောဂါ..."
      },
      "symptoms": [
        {
          "en": "Dark spots on lower leaves",
          "mm": "အောက်ပိုင်းအရွက်များတွင် မဲနက်သောအစက်များ"
        },
        {
          "en": "Yellow halos around spots",
          "mm": "အစက်များပတ်လည်တွင် အဝါရောင်ကွင်းများ"
        }
      ],
      "plantType": {
        "en": "Vegetable",
        "mm": "ရွက်သီးရွက်ရင်း"
      },
      "treatments": [
        {
          "en": "Apply copper fungicide",
          "mm": "ကြေးနီမှိုသတ်ဆေး သုံးပေးခြင်း"
        },
        {
          "en": "Remove infected leaves",
          "mm": "ပိုးဝင်နေသော အရွက်များကို ဖယ်ရှားခြင်း"
        }
      ],
      "detection": {
        "confidence": "87.32",
        "imageUrl": "/uploads/detection-123.jpg",
        "detectedAt": "2023-01-01T12:00:00.000Z"
      }
    }
  ]
}
```

## 📚 Plant Care Guides Multilingual Response

Plant care guides also support multilingual content:

```json
{
  "status": "success",
  "data": {
    "guides": [
      {
        "_id": "guide1",
        "plantName": {
          "en": "Tomato",
          "mm": "ခရမ်းချဉ်သီး"
        },
        "scientificName": "Solanum lycopersicum",
        "plantType": {
          "en": "Vegetable",
          "mm": "ရွက်သီးရွက်ရင်း"
        },
        "description": {
          "en": "Tomatoes are popular vegetables for home gardens...",
          "mm": "ခရမ်းချဉ်သီးများသည် အိမ်ဥယျာဉ်အတွက် လူကြိုက်များသော..."
        },
        "difficulty": "intermediate",
        "featured": true,
        "views": 1250,
        "ratings": {
          "average": 4.5,
          "count": 45
        }
      }
    ]
  }
}
```

## 🔨 Frontend Integration with `utils.ts`

### Using the Existing Helper Functions

Your frontend already has the perfect helper functions in `lib/utils.ts`:

```typescript
// Use this function to extract localized content
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

// Use this hook in React components
export function useLocalizedProperty(obj: any): string {
  const locale = useLocale();
  return getLocalizedProperty(obj, locale);
}
```

## 🎯 Implementation Examples

### 1. Disease Detection Results Display

```typescript
import { useLocalizedProperty, getLocalizedProperty } from '@/lib/utils';
import { useLocale } from 'next-intl';

interface DetectionResult {
  name: { en: string; mm: string };
  description: { en: string; mm: string };
  symptoms: { en: string; mm: string }[];
  plantType: { en: string; mm: string };
  treatments: { en: string; mm: string }[];
  detection: {
    confidence: string;
    imageUrl: string;
    detectedAt: string;
  };
}

const DetectionResultCard = ({ result }: { result: DetectionResult }) => {
  const locale = useLocale();
  
  // Method 1: Using the hook
  const diseaseName = useLocalizedProperty(result.name);
  const description = useLocalizedProperty(result.description);
  
  // Method 2: Using the function directly
  const plantType = getLocalizedProperty(result.plantType, locale);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-900">{diseaseName}</h3>
      <p className="text-sm text-gray-600 mb-2">{plantType}</p>
      <p className="text-gray-700 mb-4">{description}</p>
      
      <div className="mb-4">
        <h4 className="font-semibold mb-2">
          {locale === 'mm' ? 'လက္ခဏာများ' : 'Symptoms'}
        </h4>
        <ul className="list-disc list-inside space-y-1">
          {result.symptoms.map((symptom, index) => (
            <li key={index} className="text-gray-600">
              {getLocalizedProperty(symptom, locale)}
            </li>
          ))}
        </ul>
      </div>
      
      <div>
        <h4 className="font-semibold mb-2">
          {locale === 'mm' ? 'ကုသမှုများ' : 'Treatments'}
        </h4>
        <ul className="list-disc list-inside space-y-1">
          {result.treatments.map((treatment, index) => (
            <li key={index} className="text-gray-600">
              {getLocalizedProperty(treatment, locale)}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="mt-4 text-sm text-gray-500">
        {locale === 'mm' ? 'ယုံကြည်မှု' : 'Confidence'}: {result.detection.confidence}%
      </div>
    </div>
  );
};
```

### 2. Plant Care Guides Display

```typescript
interface PlantGuide {
  _id: string;
  plantName: { en: string; mm: string };
  plantType: { en: string; mm: string };
  description: { en: string; mm: string };
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  featured: boolean;
  ratings: { average: number; count: number };
}

const PlantGuideCard = ({ guide }: { guide: PlantGuide }) => {
  const locale = useLocale();
  
  const plantName = useLocalizedProperty(guide.plantName);
  const plantType = useLocalizedProperty(guide.plantType);
  const description = useLocalizedProperty(guide.description);
  
  // Localize difficulty level
  const difficultyLabels = {
    beginner: { en: 'Beginner', mm: 'အစပြု' },
    intermediate: { en: 'Intermediate', mm: 'အလယ်အလတ်' },
    advanced: { en: 'Advanced', mm: 'အဆင့်မြင့်' }
  };
  
  const difficultyLabel = getLocalizedProperty(
    difficultyLabels[guide.difficulty], 
    locale
  );
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{plantName}</h3>
          <p className="text-sm text-gray-600">{plantType}</p>
        </div>
        {guide.featured && (
          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
            {locale === 'mm' ? 'ရွေးချယ်ထားသော' : 'Featured'}
          </span>
        )}
      </div>
      
      <p className="text-gray-700 mb-4 line-clamp-3">{description}</p>
      
      <div className="flex justify-between items-center">
        <span className={`px-2 py-1 rounded text-xs ${
          guide.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
          guide.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {difficultyLabel}
        </span>
        
        <div className="flex items-center space-x-1">
          <span className="text-yellow-400">★</span>
          <span className="text-sm text-gray-600">
            {guide.ratings.average.toFixed(1)} ({guide.ratings.count})
          </span>
        </div>
      </div>
    </div>
  );
};
```

### 3. Search and Filter Components

```typescript
const PlantGuideSearch = () => {
  const locale = useLocale();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  
  // Localized plant types for filter dropdown
  const plantTypes = [
    { value: 'vegetable', label: { en: 'Vegetable', mm: 'ရွက်သီးရွက်ရင်း' } },
    { value: 'herb', label: { en: 'Herb', mm: 'ဆေးဖက်ဝင်အပင်' } },
    { value: 'fruit', label: { en: 'Fruit', mm: 'အသီးအနှံ' } },
  ];
  
  const handleSearch = async () => {
    const response = await fetch(
      `/api/plant-care/guides/search?q=${searchQuery}&plantType=${selectedType}`,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    const data = await response.json();
    // Handle search results...
  };
  
  return (
    <div className="space-y-4">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={locale === 'mm' ? 'ရှာဖွေရန်...' : 'Search plants...'}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
      />
      
      <select
        value={selectedType}
        onChange={(e) => setSelectedType(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
      >
        <option value="">
          {locale === 'mm' ? 'အားလုံးရွေးချယ်ရန်' : 'All Types'}
        </option>
        {plantTypes.map((type) => (
          <option key={type.value} value={type.value}>
            {getLocalizedProperty(type.label, locale)}
          </option>
        ))}
      </select>
      
      <button
        onClick={handleSearch}
        className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
      >
        {locale === 'mm' ? 'ရှာဖွေရန်' : 'Search'}
      </button>
    </div>
  );
};
```

## 🔄 API Integration Patterns

### 1. Fetching and Processing Multilingual Data

```typescript
// Custom hook for disease detection
const useDetectDisease = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<DetectionResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const detectDisease = async (imageFile: File) => {
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      
      const response = await fetch('/api/detections/detect', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });
      
      if (!response.ok) throw new Error('Detection failed');
      
      const data = await response.json();
      setResults(data.data); // Multilingual data is ready to use!
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };
  
  return { detectDisease, loading, results, error };
};
```

### 2. Caching Multilingual Content

```typescript
// Consider caching multilingual content for better performance
const useCachedPlantGuides = () => {
  const [guides, setGuides] = useState<PlantGuide[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchGuides = async () => {
      // Check cache first
      const cachedGuides = localStorage.getItem('plant-guides');
      if (cachedGuides) {
        setGuides(JSON.parse(cachedGuides));
        setLoading(false);
        return;
      }
      
      // Fetch from API
      try {
        const response = await fetch('/api/plant-care/guides');
        const data = await response.json();
        
        setGuides(data.data.guides);
        
        // Cache for 1 hour
        localStorage.setItem('plant-guides', JSON.stringify(data.data.guides));
        localStorage.setItem('plant-guides-timestamp', Date.now().toString());
        
      } catch (error) {
        console.error('Failed to fetch plant guides:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchGuides();
  }, []);
  
  return { guides, loading };
};
```

## 🎨 UI/UX Best Practices

### 1. Language Switching

```typescript
const LanguageSwitcher = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  
  const switchLanguage = (newLocale: string) => {
    router.push(pathname, { locale: newLocale });
  };
  
  return (
    <div className="flex space-x-2">
      <button
        onClick={() => switchLanguage('en')}
        className={`px-3 py-1 rounded ${
          locale === 'en' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
        }`}
      >
        English
      </button>
      <button
        onClick={() => switchLanguage('mm')}
        className={`px-3 py-1 rounded ${
          locale === 'mm' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
        }`}
      >
        မြန်မာ
      </button>
    </div>
  );
};
```

### 2. Handling Missing Translations

```typescript
const SafeLocalizedText = ({ 
  content, 
  fallback = 'Content not available' 
}: { 
  content: any; 
  fallback?: string 
}) => {
  const localizedText = useLocalizedProperty(content);
  
  return (
    <span className={localizedText === fallback ? 'italic text-gray-500' : ''}>
      {localizedText || fallback}
    </span>
  );
};
```

## 📋 Implementation Checklist

### Backend Integration ✅
- [x] Disease detection responses are multilingual
- [x] Plant care guides support multiple languages
- [x] Search functionality works with both languages
- [x] Filtering supports multilingual plant types
- [x] API responses include both English and Myanmar content

### Frontend Integration Tasks 📝
- [ ] Update detection result display components
- [ ] Implement multilingual plant care guide cards
- [ ] Add language-aware search functionality
- [ ] Update form labels and placeholders
- [ ] Test language switching functionality
- [ ] Add fallback handling for missing translations
- [ ] Implement caching for better performance
- [ ] Add loading states during language switches

## 🚀 Performance Optimizations

1. **Content Caching**: Cache multilingual content locally to avoid repeated API calls
2. **Lazy Loading**: Load translations on-demand for better initial load times
3. **Fallback Strategy**: Always have English as fallback to ensure content is never empty
4. **Preloading**: Preload critical content in both languages for instant switching

## 🔧 Troubleshooting

### Common Issues and Solutions

1. **Missing Translations**: The `getLocalizedProperty` function handles this with fallbacks
2. **Performance Issues**: Implement proper caching and memoization
3. **Layout Shifts**: Myanmar text may have different lengths; plan UI accordingly
4. **Font Support**: Ensure your fonts support Myanmar unicode characters

## 📈 Future Enhancements

Consider implementing:
- **Dynamic Translation Loading**: Load translations from external services
- **User Preference Storage**: Remember user's language choice
- **Contextual Translations**: Different translations based on user expertise level
- **Voice Output**: Text-to-speech in both languages for accessibility

---

This localization system provides seamless multilingual support that integrates perfectly with your existing `utils.ts` helper functions. The backend is ready to serve content in both English and Myanmar, making it easy to create a truly localized experience for your users! 🌍✨
