import { Request, Response } from 'express';
import { Disease, PlantGuide, HealthyFood } from '../models';

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

    // Search diseases from database
    if (query) {
      const searchConditions = {
        $or: [
          { [`name.${language}`]: { $regex: query, $options: 'i' } },
          { [`description.${language}`]: { $regex: query, $options: 'i' } },
          { [`symptoms.${language}`]: { $regex: query, $options: 'i' } },
          { [`plantType.${language}`]: { $regex: query, $options: 'i' } }
        ]
      };
      results.diseases = await Disease.find(searchConditions).limit(20);
    }

    // Search plant care guides from database
    if (query || category) {
      let searchConditions: any = {};
      
      if (query) {
        searchConditions.$or = [
          { [`plantName.${language}`]: { $regex: query, $options: 'i' } },
          { [`description.${language}`]: { $regex: query, $options: 'i' } },
          { tags: { $regex: query, $options: 'i' } }
        ];
      }
      
      if (category) {
        searchConditions.category = category;
      }
      
      results.plantGuides = await PlantGuide.find(searchConditions).limit(20);
    }

    // Search healthy foods from database
    if (query || category) {
      let searchConditions: any = {};
      
      if (query) {
        searchConditions.$or = [
          { [`title.${language}`]: { $regex: query, $options: 'i' } },
          { [`description.${language}`]: { $regex: query, $options: 'i' } },
          { [`keyBenefits.${language}`]: { $in: [new RegExp(query, 'i')] } },
          { [`keyNutrients.${language}`]: { $in: [new RegExp(query, 'i')] } }
        ];
      }
      
      if (category) {
        searchConditions.category = category;
      }
      
      results.healthyFoods = await HealthyFood.find(searchConditions).limit(20);
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
    
    let searchConditions: any = {};
    
    if (query) {
      searchConditions.$or = [
        { [`name.${language}`]: { $regex: query, $options: 'i' } },
        { [`description.${language}`]: { $regex: query, $options: 'i' } },
        { [`symptoms.${language}`]: { $regex: query, $options: 'i' } },
        { [`plantType.${language}`]: { $regex: query, $options: 'i' } }
      ];
    }
    
    if (plantType) {
      searchConditions[`plantType.${language}`] = { $regex: plantType, $options: 'i' };
    }

    const diseases = await Disease.find(searchConditions).limit(50);

    res.json({
      status: 'success',
      data: { diseases },
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
    
    let searchConditions: any = {};
    
    if (query) {
      searchConditions.$or = [
        { [`plantName.${language}`]: { $regex: query, $options: 'i' } },
        { [`description.${language}`]: { $regex: query, $options: 'i' } },
        { tags: { $regex: query, $options: 'i' } }
      ];
    }
    
    if (category) {
      searchConditions.category = category;
    }
    
    if (tags) {
      const tagArray = (tags as string).split(',').map(tag => tag.trim());
      searchConditions.tags = { $in: tagArray };
    }

    const guides = await PlantGuide.find(searchConditions).limit(50);

    res.json({
      status: 'success',
      data: { guides },
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
    
    let searchConditions: any = {};
    
    if (query) {
      searchConditions.$or = [
        { [`title.${language}`]: { $regex: query, $options: 'i' } },
        { [`description.${language}`]: { $regex: query, $options: 'i' } },
        { [`keyBenefits.${language}`]: { $in: [new RegExp(query, 'i')] } },
        { [`keyNutrients.${language}`]: { $in: [new RegExp(query, 'i')] } }
      ];
    }
    
    if (category) {
      searchConditions.category = category;
    }
    
    if (season) {
      searchConditions.season = { $in: [season, 'Year-round'] };
    }
    
    if (nutrients) {
      const nutrientArray = (nutrients as string).split(',').map(n => n.trim());
      searchConditions.keyNutrients = { $in: nutrientArray };
    }

    const foods = await HealthyFood.find(searchConditions).limit(50);

    res.json({
      status: 'success',
      data: { foods },
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
      const diseases = await Disease.find({
        [`name.${language}`]: { $regex: query, $options: 'i' }
      }).limit(5).select(`name.${language}`);
      
      diseases.forEach(disease => {
        suggestions.push(disease.name[language as keyof typeof disease.name]);
      });
    }
    
    if (!type || type === 'plants') {
      const guides = await PlantGuide.find({
        [`plantName.${language}`]: { $regex: query, $options: 'i' }
      }).limit(5).select(`plantName.${language}`);
      
      guides.forEach(guide => {
        suggestions.push(guide.plantName[language as keyof typeof guide.plantName]);
      });
    }
    
    if (!type || type === 'foods') {
      const foods = await HealthyFood.find({
        [`title.${language}`]: { $regex: query, $options: 'i' }
      }).limit(5).select(`title.${language}`);
      
      foods.forEach(food => {
        suggestions.push(food.title[language as keyof typeof food.title]);
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