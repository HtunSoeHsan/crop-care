# Search Implementation Guide

This document outlines the implementation of the comprehensive search functionality for the Crop Care application, replacing mock data with real database integration.

## Overview

The search functionality allows users to search across three main content types:
- **Plant Diseases**: Information about various plant diseases, symptoms, and treatments
- **Plant Care Guides**: Detailed care instructions for different plants
- **Healthy Foods**: Nutritional information about healthy foods

## Backend Implementation

### Database Models

#### 1. Disease Model (`/backend/src/models/Disease.ts`)
```typescript
interface IDisease {
  classIndex: number;
  name: { en: string; my: string; };
  description: { en: string; my: string; };
  symptoms: Array<{ en: string; my: string; }>;
  plantType: { en: string; my: string; };
  treatments: Array<{
    name: { en: string; my: string; };
    description: { en: string; my: string; };
    steps: Array<{ en: string; my: string; }>;
  }>;
  recommendations: Array<{ en: string; my: string; }>;
}
```

#### 2. Plant Guide Model (`/backend/src/models/PlantGuide.ts`)
```typescript
interface IPlantGuide {
  plantName: { en: string; my: string; };
  scientificName?: string;
  category: string;
  description: { en: string; my: string; };
  careInstructions: {
    watering: { en: string; my: string; };
    sunlight: { en: string; my: string; };
    soil: { en: string; my: string; };
  };
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  featured: boolean;
  views: number;
}
```

#### 3. Healthy Food Model (`/backend/src/models/HealthyFood.ts`)
```typescript
interface IHealthyFood {
  name: { en: string; my: string; };
  category: string;
  nutrients: string[];
  benefits: { en: string; my: string; };
  season: string;
  tags: string[];
  featured: boolean;
  views: number;
}
```

### Search Controller (`/backend/src/controllers/search.controller.ts`)

The search controller provides the following endpoints:

#### 1. Comprehensive Search (`GET /api/search/all`)
Searches across all content types with the following parameters:
- `q`: Search query string
- `category`: Filter by category
- `type`: Filter by content type
- `language`: Language preference (en/my)

#### 2. Disease-Specific Search (`GET /api/search/diseases`)
Parameters:
- `q`: Search query
- `severity`: Filter by severity level
- `plantType`: Filter by affected plant type
- `language`: Language preference

#### 3. Plant Guide Search (`GET /api/search/plant-guides`)
Parameters:
- `q`: Search query
- `category`: Plant category
- `tags`: Comma-separated tags
- `language`: Language preference

#### 4. Healthy Food Search (`GET /api/search/healthy-foods`)
Parameters:
- `q`: Search query
- `category`: Food category
- `season`: Growing season
- `nutrients`: Comma-separated nutrients
- `language`: Language preference

#### 5. Search Suggestions (`GET /api/search/suggestions`)
Provides autocomplete suggestions based on partial queries.

### Database Seeding

#### Seed Files:
1. `/backend/src/seeders/plant-guide.seeder.ts` - Plant care guide data
2. `/backend/src/seeders/healthy-food.seeder.ts` - Healthy food data
3. `/backend/src/seeders/index.ts` - Main seeder runner

#### Running Seeders:
```bash
cd backend
npm run seed
```

## Frontend Implementation

### Search Page (`/frontend/app/search/page.tsx`)

The search page provides:
- **Unified Search Interface**: Single search box for all content types
- **Advanced Filters**: Category, type, and language filters
- **Tabbed Results**: Organized results by content type
- **Multilingual Support**: English and Burmese language support
- **Responsive Design**: Works on all device sizes

### Key Features:

#### 1. Search Form
- Text input with search suggestions
- Filter dropdowns for category, type, and language
- Active filter display with removal options
- Clear all filters functionality

#### 2. Results Display
- Tabbed interface showing all results, diseases, plants, and foods
- Card-based layout for each result
- Relevant metadata display (symptoms, care instructions, nutrients)
- Result counts for each tab

#### 3. Error Handling
- Loading states during search
- Error messages with retry options
- Empty state when no results found

### API Service (`/frontend/lib/api-service.ts`)

The SearchService provides methods for:
- `searchAll()`: Comprehensive search
- `searchDiseases()`: Disease-specific search
- `searchPlantGuides()`: Plant guide search
- `searchHealthyFoods()`: Healthy food search
- `getSearchSuggestions()`: Autocomplete suggestions

## Multilingual Support

### Language Structure
All content supports English (`en`) and Burmese (`my`) languages:
```typescript
{
  name: {
    en: "English Name",
    my: "မြန်မာအမည်"
  }
}
```

### Translation Files
- `/frontend/messages/en.json` - English translations
- `/frontend/messages/my.json` - Burmese translations

## Database Indexing

### Search Optimization
Text indexes are created for efficient searching:
```typescript
// Plant Guide indexes
PlantGuideSchema.index({ 
  'plantName.en': 'text', 
  'plantName.my': 'text', 
  'description.en': 'text', 
  'description.my': 'text' 
});

// Category and tag indexes
PlantGuideSchema.index({ category: 1 });
PlantGuideSchema.index({ tags: 1 });
```

## Usage Examples

### Basic Search
```javascript
const results = await SearchService.searchAll("tomato", {
  language: "en"
});
```

### Filtered Search
```javascript
const results = await SearchService.searchPlantGuides("basil", {
  category: "herbs",
  language: "en"
});
```

### Search with Multiple Filters
```javascript
const results = await SearchService.searchHealthyFoods("spinach", {
  category: "leafy-greens",
  season: "spring",
  nutrients: "iron,vitamin-k"
});
```

## Testing the Implementation

### 1. Start the Backend
```bash
cd backend
npm run dev
```

### 2. Run Database Seeders
```bash
cd backend
npm run seed
```

### 3. Start the Frontend
```bash
cd frontend
npm run dev
```

### 4. Test Search Functionality
- Navigate to `/search`
- Try different search terms
- Test filters and language switching
- Verify results display correctly

## API Endpoints Summary

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/search/all` | GET | Search all content types |
| `/api/search/diseases` | GET | Search diseases only |
| `/api/search/plant-guides` | GET | Search plant guides only |
| `/api/search/healthy-foods` | GET | Search healthy foods only |
| `/api/search/suggestions` | GET | Get search suggestions |

## Future Enhancements

1. **Full-Text Search**: Implement MongoDB Atlas Search for better text search capabilities
2. **Search Analytics**: Track popular search terms and improve results
3. **Personalized Results**: Show results based on user preferences and history
4. **Advanced Filters**: Add more specific filters like plant difficulty, seasonal availability
5. **Search History**: Save user search history for quick access
6. **Fuzzy Matching**: Implement fuzzy search for typo tolerance
7. **Image Search**: Allow searching by plant images
8. **Geolocation-Based Results**: Show region-specific plant information

## Troubleshooting

### Common Issues:

1. **No Search Results**: Ensure database is seeded with `npm run seed`
2. **Language Issues**: Check that language parameter is correctly passed
3. **Filter Not Working**: Verify filter values match database categories
4. **Performance Issues**: Check database indexes are properly created

### Debug Tips:

1. Check browser console for API errors
2. Verify backend logs for database connection issues
3. Test API endpoints directly using tools like Postman
4. Ensure MongoDB is running and accessible

This implementation provides a robust, scalable search system that can be easily extended with additional features and content types.