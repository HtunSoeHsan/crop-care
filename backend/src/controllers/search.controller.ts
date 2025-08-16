import { Request, Response } from 'express';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load seeder data
const loadSeederData = () => {
  try {
    const plantDiseaseData = readFileSync(
      join(__dirname, '../../data/plant-disease-knowledge.json'),
      'utf-8'
    );
    return JSON.parse(plantDiseaseData);
  } catch (error) {
    console.error('Error loading seeder data:', error);
    return [];
  }
};

// Mock plant care guides data (in a real app, this would come from database)
const mockPlantCareGuides: any[] = [
  {
    id: 'tomato-care',
    plantName: { en: 'Tomato', my: 'တမာတို' },
    scientificName: 'Solanum lycopersicum',
    category: 'vegetables',
    description: { en: 'Popular garden vegetable with many varieties', my: 'ဥယျာဉ်တွင်ရေပန်းစားသော ဟင်းသီးဟင်းရွက်မျိုးစုံ' },
    careInstructions: {
      watering: { en: 'Keep soil consistently moist', my: 'မြေဆီလွှာကို စိုစွတ်နေစေပါ' },
      sunlight: { en: 'Full sun (6-8 hours daily)', my: 'နေရောင်ပြည့် (တစ်နေ့ ၆-၈ နာရီ)' },
      soil: { en: 'Well-draining, rich soil', my: 'ရေထုတ်ကောင်းသော မြေဆီလွှာ' }
    },
    tags: ['vegetables', 'annual', 'sun-loving', 'fruit-bearing']
  },
  {
    id: 'basil-care',
    plantName: { en: 'Basil', my: 'ပင်စိမ်း' },
    scientificName: 'Ocimum basilicum',
    category: 'herbs',
    description: { en: 'Aromatic herb used in cooking', my: 'ချက်ပြုတ်ရာတွင် အသုံးပြုသော ရနံ့ထူးသော ဟင်းခတ်အမွှေးအကြိုင်' },
    careInstructions: {
      watering: { en: 'Moderate watering, avoid overwatering', my: 'အလယ်အလတ် ရေလောင်းပါ၊ ရေများမလောင်းပါနှင့်' },
      sunlight: { en: 'Partial to full sun', my: 'နေရောင်အလယ်အလတ်မှ ပြည့်ဝသော' },
      soil: { en: 'Well-draining, slightly acidic', my: 'ရေထုတ်ကောင်းသော၊ အက်စစ်ဓာတ်အနည်းငယ်ပါသော' }
    },
    tags: ['herbs', 'annual', 'culinary', 'medicinal']
  }
];

// Mock healthy foods data
const mockHealthyFoods: any[] = [
  {
    id: 'spinach',
    name: { en: 'Spinach', my: 'ဟင်းနုနွယ်' },
    category: 'leafy-greens',
    nutrients: ['iron', 'vitamin-k', 'folate', 'antioxidants'],
    benefits: { en: 'Supports bone health and immune system', my: 'အရိုးကျန်းမာရေးနှင့် ကိုယ်ခံအားစနစ်ကို ထောက်ပံ့ပေးသည်' },
    season: 'spring',
    tags: ['vegetables', 'iron-rich', 'low-calorie', 'antioxidant']
  },
  {
    id: 'blueberries',
    name: { en: 'Blueberries', my: 'ဘလူးဘယ်ရီ' },
    category: 'berries',
    nutrients: ['vitamin-c', 'fiber', 'antioxidants', 'vitamin-k'],
    benefits: { en: 'Excellent source of antioxidants and brain health', my: 'အန်တီအောက်ဆီဒင့်နှင့် ဦးနှောက်ကျန်းမာရေးအတွက် ထူးကဲသော အရင်းအမြစ်' },
    season: 'summer',
    tags: ['fruits', 'antioxidant', 'brain-health', 'low-sugar']
  }
];

export const searchAll = async (req: Request, res: Response) => {
  try {
    const { q, category, type, language = 'en' } = req.query;
    const query = (q as string)?.toLowerCase() || '';
    
    let results: {
      diseases: any[];
      plantGuides: any[];
      healthyFoods: any[];
      totalResults: number;
    } = {
      diseases: [],
      plantGuides: [],
      healthyFoods: [],
      totalResults: 0
    };

    // Search diseases
    if (query) {
      const diseaseData = loadSeederData();
      results.diseases = diseaseData.filter((disease: any) => 
        disease.disease.toLowerCase().includes(query) ||
        disease.symptoms.some((symptom: string) => symptom.toLowerCase().includes(query)) ||
        disease.causes.some((cause: string) => cause.toLowerCase().includes(query)) ||
        disease.treatments.some((treatment: string) => treatment.toLowerCase().includes(query)) ||
        disease.plantTypes.some((plant: string) => plant.toLowerCase().includes(query))
      );
    }

    // Search plant care guides
    if (query || category) {
      let filteredGuides = mockPlantCareGuides;
      
      if (query) {
        filteredGuides = filteredGuides.filter(guide => 
          guide.plantName[language as keyof typeof guide.plantName]?.toLowerCase().includes(query) ||
          guide.description[language as keyof typeof guide.description]?.toLowerCase().includes(query) ||
          guide.tags.some((tag: string) => tag.toLowerCase().includes(query))
        );
      }
      
      if (category) {
        filteredGuides = filteredGuides.filter(guide => 
          guide.category === category || guide.tags.includes(category as string)
        );
      }
      
      results.plantGuides = filteredGuides;
    }

    // Search healthy foods
    if (query || category) {
      let filteredFoods = mockHealthyFoods;
      
      if (query) {
        filteredFoods = filteredFoods.filter(food => 
          food.name[language as keyof typeof food.name]?.toLowerCase().includes(query) ||
          food.benefits[language as keyof typeof food.benefits]?.toLowerCase().includes(query) ||
          food.tags.some((tag: string) => tag.toLowerCase().includes(query)) ||
          food.nutrients.some((nutrient: string) => nutrient.toLowerCase().includes(query))
        );
      }
      
      if (category) {
        filteredFoods = filteredFoods.filter(food => 
          food.category === category || food.tags.includes(category as string)
        );
      }
      
      results.healthyFoods = filteredFoods;
    }

    // Calculate total results
    results.totalResults = results.diseases.length + results.plantGuides.length + results.healthyFoods.length;

    res.json({
      status: 'success',
      data: results,
      query: query || '',
      filters: { category, type, language }
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error performing search'
    });
  }
};

export const searchDiseases = async (req: Request, res: Response) => {
  try {
    const { q, severity, plantType, language = 'en' } = req.query;
    const query = (q as string)?.toLowerCase() || '';
    
    let diseaseData = loadSeederData();
    
    if (query) {
      diseaseData = diseaseData.filter((disease: any) => 
        disease.disease.toLowerCase().includes(query) ||
        disease.symptoms.some((symptom: string) => symptom.toLowerCase().includes(query)) ||
        disease.causes.some((cause: string) => cause.toLowerCase().includes(query)) ||
        disease.treatments.some((treatment: string) => treatment.toLowerCase().includes(query)) ||
        disease.plantTypes.some((plant: string) => plant.toLowerCase().includes(query))
      );
    }
    
    if (severity) {
      diseaseData = diseaseData.filter((disease: any) => 
        disease.severity === severity
      );
    }
    
    if (plantType) {
      diseaseData = diseaseData.filter((disease: any) => 
        disease.plantTypes.some((plant: string) => 
          plant.toLowerCase().includes(plantType as string)
        )
      );
    }

    res.json({
      status: 'success',
      data: { diseases: diseaseData },
      query: query || '',
      filters: { severity, plantType, language }
    });
  } catch (error) {
    console.error('Disease search error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error searching diseases'
    });
  }
};

export const searchPlantGuides = async (req: Request, res: Response) => {
  try {
    const { q, category, tags, language = 'en' } = req.query;
    const query = (q as string)?.toLowerCase() || '';
    
    let filteredGuides = mockPlantCareGuides;
    
    if (query) {
      filteredGuides = filteredGuides.filter(guide => 
        guide.plantName[language as keyof typeof guide.plantName]?.toLowerCase().includes(query) ||
        guide.description[language as keyof typeof guide.description]?.toLowerCase().includes(query) ||
        guide.tags.some((tag: string) => tag.toLowerCase().includes(query))
      );
    }
    
    if (category) {
      filteredGuides = filteredGuides.filter(guide => 
        guide.category === category
      );
    }
    
    if (tags) {
      const tagArray = (tags as string).split(',').map(tag => tag.trim().toLowerCase());
      filteredGuides = filteredGuides.filter(guide => 
        guide.tags.some((tag: string) => tagArray.includes(tag.toLowerCase()))
      );
    }

    res.json({
      status: 'success',
      data: { guides: filteredGuides },
      query: query || '',
      filters: { category, tags, language }
    });
  } catch (error) {
    console.error('Plant guide search error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error searching plant guides'
    });
  }
};

export const searchHealthyFoods = async (req: Request, res: Response) => {
  try {
    const { q, category, season, nutrients, language = 'en' } = req.query;
    const query = (q as string)?.toLowerCase() || '';
    
    let filteredFoods = mockHealthyFoods;
    
    if (query) {
      filteredFoods = filteredFoods.filter(food => 
        food.name[language as keyof typeof food.name]?.toLowerCase().includes(query) ||
        food.benefits[language as keyof typeof food.benefits]?.toLowerCase().includes(query) ||
        food.tags.some((tag: string) => tag.toLowerCase().includes(query)) ||
        food.nutrients.some((nutrient: string) => nutrient.toLowerCase().includes(query))
      );
    }
    
    if (category) {
      filteredFoods = filteredFoods.filter(food => 
        food.category === category
      );
    }
    
    if (season) {
      filteredFoods = filteredFoods.filter(food => 
        food.season === season || food.season === 'year-round'
      );
    }
    
    if (nutrients) {
      const nutrientArray = (nutrients as string).split(',').map(n => n.trim().toLowerCase());
      filteredFoods = filteredFoods.filter(food => 
        food.nutrients.some((nutrient: string) => nutrientArray.includes(nutrient.toLowerCase()))
      );
    }

    res.json({
      status: 'success',
      data: { foods: filteredFoods },
      query: query || '',
      filters: { category, season, nutrients, language }
    });
  } catch (error) {
    console.error('Healthy food search error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error searching healthy foods'
    });
  }
};

export const getSearchSuggestions = async (req: Request, res: Response) => {
  try {
    const { q, type, language = 'en' } = req.query;
    const query = (q as string)?.toLowerCase() || '';
    
    if (!query || query.length < 2) {
      return res.json({
        status: 'success',
        data: { suggestions: [] }
      });
    }

    let suggestions: string[] = [];
    
    if (!type || type === 'diseases') {
      const diseaseData = loadSeederData();
      diseaseData.forEach((disease: any) => {
        if (disease.disease.toLowerCase().includes(query)) {
          suggestions.push(disease.disease);
        }
        disease.plantTypes.forEach((plant: string) => {
          if (plant.toLowerCase().includes(query)) {
            suggestions.push(plant);
          }
        });
      });
    }
    
    if (!type || type === 'plants') {
      mockPlantCareGuides.forEach(guide => {
        const name = guide.plantName[language as keyof typeof guide.plantName];
        if (name?.toLowerCase().includes(query)) {
          suggestions.push(name);
        }
      });
    }
    
    if (!type || type === 'foods') {
      mockHealthyFoods.forEach(food => {
        const name = food.name[language as keyof typeof food.name];
        if (name?.toLowerCase().includes(query)) {
          suggestions.push(name);
        }
      });
    }

    // Remove duplicates and limit results
    suggestions = [...new Set(suggestions)].slice(0, 10);

    res.json({
      status: 'success',
      data: { suggestions }
    });
  } catch (error) {
    console.error('Search suggestions error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error getting search suggestions'
    });
  }
}; 