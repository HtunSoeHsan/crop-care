import { Request, Response } from 'express';

// Mock data structure for plant care guides
// In production, this would come from a database
interface PlantGuide {
  _id: string;
  plantName: {
    en: string;
    mm: string;
  };
  scientificName: string;
  plantType: {
    en: string;
    mm: string;
  };
  description: {
    en: string;
    mm: string;
  };
  images: string[];
  careInstructions: {
    watering: {
      frequency: string;
      amount: string;
      tips: string[];
    };
    sunlight: {
      requirement: string;
      hours: string;
      tips: string[];
    };
    soil: {
      type: string;
      pH: string;
      drainage: string;
      tips: string[];
    };
    temperature: {
      optimal: string;
      minimum: string;
      maximum: string;
    };
    humidity: {
      optimal: string;
      minimum: string;
      maximum: string;
    };
    fertilizing: {
      frequency: string;
      type: string;
      tips: string[];
    };
    pruning: {
      frequency: string;
      season: string;
      tips: string[];
    };
  };
  commonDiseases: {
    name: string;
    symptoms: string[];
    causes: string[];
    prevention: string[];
    treatment: string[];
  }[];
  seasonalCare: {
    spring: string[];
    summer: string[];
    autumn: string[];
    winter: string[];
  };
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  createdBy: string;
  featured: boolean;
  views: number;
  ratings: {
    average: number;
    count: number;
    userRatings: { userId: string; rating: number }[];
  };
  createdAt: Date;
  updatedAt: Date;
}

// Mock database for demonstration
const mockPlantGuides: PlantGuide[] = [
  {
    _id: 'guide1',
    plantName: {
      en: 'Tomato',
      mm: 'ခရမ်းချဉ်သီး'
    },
    scientificName: 'Solanum lycopersicum',
    plantType: {
      en: 'Vegetable',
      mm: 'ရွက်သီးရွက်ရင်း'
    },
    description: {
      en: 'Tomatoes are one of the most popular vegetables to grow in home gardens. They require warm weather and plenty of sunlight to produce healthy fruit.',
      mm: 'ခရမ်းချဉ်သီးသည် အိမ်တွင်းဥယျာဉ်များတွင် စိုက်ပျိုးရန် လူကြိုက်များဆုံး ရွက်သီးရွက်ရင်းများထဲမှ တစ်ခုဖြစ်သည်။ ကျန်းမာသော အသီးများ ထွက်ရှိစေရန် နွေးထွေးသော ရာသီဥတုနှင့် နေရောင်ခြည် များစွာ လိုအပ်သည်။'
    },
    images: ['/images/tomato-plant.jpg', '/images/tomato-fruit.jpg'],
    careInstructions: {
      watering: {
        frequency: 'Daily during growing season',
        amount: '1-2 inches per week',
        tips: [
          'Water at soil level to prevent leaf diseases',
          'Maintain consistent moisture to prevent blossom end rot',
          'Reduce watering as harvest approaches'
        ]
      },
      sunlight: {
        requirement: 'Full sun',
        hours: '6-8 hours daily',
        tips: [
          'Choose the sunniest spot in your garden',
          'Ensure good air circulation',
          'Protect from strong winds'
        ]
      },
      soil: {
        type: 'Well-draining, rich loam',
        pH: '6.0-6.8',
        drainage: 'Excellent drainage required',
        tips: [
          'Add compost before planting',
          'Ensure soil temperature is at least 60°F',
          'Consider raised beds for better drainage'
        ]
      },
      temperature: {
        optimal: '70-75°F (21-24°C)',
        minimum: '50°F (10°C)',
        maximum: '95°F (35°C)'
      },
      humidity: {
        optimal: '40-70%',
        minimum: '30%',
        maximum: '80%'
      },
      fertilizing: {
        frequency: 'Every 2-3 weeks',
        type: 'Balanced fertilizer (10-10-10)',
        tips: [
          'Start with high nitrogen, switch to high phosphorus when flowering',
          'Add calcium to prevent blossom end rot',
          'Use organic compost for slow-release nutrients'
        ]
      },
      pruning: {
        frequency: 'Weekly during growing season',
        season: 'Throughout growing period',
        tips: [
          'Remove suckers between main stem and branches',
          'Prune lower leaves touching the ground',
          'Support heavy branches with stakes or cages'
        ]
      }
    },
    commonDiseases: [
      {
        name: 'Early Blight',
        symptoms: ['Dark spots on lower leaves', 'Yellow halos around spots', 'Premature leaf drop'],
        causes: ['High humidity', 'Poor air circulation', 'Overhead watering'],
        prevention: ['Proper spacing', 'Drip irrigation', 'Crop rotation'],
        treatment: ['Remove affected leaves', 'Apply copper fungicide', 'Improve air circulation']
      },
      {
        name: 'Late Blight',
        symptoms: ['Water-soaked spots on leaves', 'White fuzzy growth', 'Brown fruit lesions'],
        causes: ['Cool, wet weather', 'Poor air circulation', 'Infected plant material'],
        prevention: ['Avoid overhead watering', 'Ensure good drainage', 'Remove plant debris'],
        treatment: ['Remove infected plants immediately', 'Apply preventive fungicide', 'Improve garden sanitation']
      }
    ],
    seasonalCare: {
      spring: [
        'Start seeds indoors 6-8 weeks before last frost',
        'Prepare soil with compost',
        'Install support structures'
      ],
      summer: [
        'Maintain consistent watering',
        'Prune suckers regularly',
        'Monitor for pests and diseases',
        'Harvest ripe fruits regularly'
      ],
      autumn: [
        'Harvest remaining green tomatoes',
        'Remove spent plants',
        'Clean up garden debris'
      ],
      winter: [
        'Plan next year\'s garden layout',
        'Order seeds for next season',
        'Maintain garden tools'
      ]
    },
    difficulty: 'intermediate',
    tags: ['vegetable', 'summer', 'fruit', 'garden', 'warm-season'],
    createdBy: 'expert1',
    featured: true,
    views: 1250,
    ratings: {
      average: 4.5,
      count: 45,
      userRatings: []
    },
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-06-20')
  },
  {
    _id: 'guide2',
    plantName: {
      en: 'Basil',
      mm: 'ပန်းရံပင်'
    },
    scientificName: 'Ocimum basilicum',
    plantType: {
      en: 'Herb',
      mm: 'ဆေးဖက်ဝင်အပင်'
    },
    description: {
      en: 'Basil is an aromatic herb that\'s easy to grow and perfect for beginners. It\'s commonly used in cooking and has natural pest-repelling properties.',
      mm: 'ပန်းရံပင်သည် အနံ့ရှိသော ဆေးဖက်ဝင်အပင်ဖြစ်ပြီး စိုက်ပျိုးရလွယ်ကူ၍ အစပြုသူများအတွက် အကောင်းဆုံးဖြစ်သည်။ ချက်ပြုတ်ရာတွင် များစွာအသုံးပြု၍ သဘာဝအလျောက် ပိုးမွှားများကို ရှောင်ရှားစေသော ဂုဏ်သတ္တိရှိသည်။'
    },
    images: ['/images/basil-plant.jpg', '/images/basil-leaves.jpg'],
    careInstructions: {
      watering: {
        frequency: 'Every 2-3 days',
        amount: 'Keep soil consistently moist',
        tips: [
          'Water at base of plant',
          'Avoid wetting leaves',
          'Morning watering is best'
        ]
      },
      sunlight: {
        requirement: 'Full sun to partial shade',
        hours: '4-6 hours daily',
        tips: [
          'Can tolerate some afternoon shade',
          'Morning sun is essential',
          'Protect from intense heat'
        ]
      },
      soil: {
        type: 'Well-draining, fertile',
        pH: '6.0-7.0',
        drainage: 'Good drainage essential',
        tips: [
          'Rich in organic matter',
          'Avoid clay soils',
          'Container growing works well'
        ]
      },
      temperature: {
        optimal: '70-80°F (21-27°C)',
        minimum: '50°F (10°C)',
        maximum: '90°F (32°C)'
      },
      humidity: {
        optimal: '50-60%',
        minimum: '40%',
        maximum: '70%'
      },
      fertilizing: {
        frequency: 'Monthly',
        type: 'Balanced liquid fertilizer',
        tips: [
          'Light feeding is sufficient',
          'Over-fertilizing reduces flavor',
          'Compost tea works well'
        ]
      },
      pruning: {
        frequency: 'Weekly',
        season: 'Throughout growing period',
        tips: [
          'Pinch flowers to encourage leaf growth',
          'Harvest regularly to promote bushier growth',
          'Cut stems above leaf pairs'
        ]
      }
    },
    commonDiseases: [
      {
        name: 'Fusarium Wilt',
        symptoms: ['Yellowing leaves', 'Wilting despite moist soil', 'Brown stem discoloration'],
        causes: ['Soil-borne fungus', 'Poor drainage', 'Contaminated tools'],
        prevention: ['Well-draining soil', 'Crop rotation', 'Clean tools'],
        treatment: ['Remove infected plants', 'Improve soil drainage', 'Use resistant varieties']
      }
    ],
    seasonalCare: {
      spring: [
        'Start seeds indoors after last frost',
        'Transplant after soil warms',
        'Begin regular harvesting'
      ],
      summer: [
        'Harvest leaves regularly',
        'Pinch flower buds',
        'Maintain consistent moisture'
      ],
      autumn: [
        'Harvest before first frost',
        'Dry or preserve leaves',
        'Collect seeds for next year'
      ],
      winter: [
        'Grow indoors on sunny windowsill',
        'Plan next year\'s herb garden',
        'Use preserved herbs in cooking'
      ]
    },
    difficulty: 'beginner',
    tags: ['herb', 'culinary', 'aromatic', 'easy', 'container'],
    createdBy: 'expert2',
    featured: false,
    views: 890,
    ratings: {
      average: 4.8,
      count: 32,
      userRatings: []
    },
    createdAt: new Date('2023-02-10'),
    updatedAt: new Date('2023-05-15')
  }
];

export const getAllPlantGuides = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, difficulty, plantType } = req.query;
    
    let filteredGuides = [...mockPlantGuides];
    
    // Apply filters
    if (difficulty) {
      filteredGuides = filteredGuides.filter(guide => guide.difficulty === difficulty);
    }
    
    if (plantType) {
      filteredGuides = filteredGuides.filter(guide => 
        guide.plantType.en.toLowerCase().includes((plantType as string).toLowerCase()) ||
        guide.plantType.mm.toLowerCase().includes((plantType as string).toLowerCase())
      );
    }
    
    // Pagination
    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = startIndex + Number(limit);
    const paginatedGuides = filteredGuides.slice(startIndex, endIndex);
    
    res.json({
      status: 'success',
      data: {
        guides: paginatedGuides,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(filteredGuides.length / Number(limit)),
          totalGuides: filteredGuides.length,
          hasNext: endIndex < filteredGuides.length,
          hasPrev: startIndex > 0
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching plant guides'
    });
  }
};

export const getPlantGuide = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const guide = mockPlantGuides.find(g => g._id === id);
    
    if (!guide) {
      return res.status(404).json({
        status: 'error',
        message: 'Plant guide not found'
      });
    }
    
    // Increment view count (in real app, update database)
    guide.views += 1;
    
    res.json({
      status: 'success',
      data: { guide }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching plant guide'
    });
  }
};

export const getFeaturedGuides = async (req: Request, res: Response) => {
  try {
    const featuredGuides = mockPlantGuides.filter(guide => guide.featured);
    
    res.json({
      status: 'success',
      data: { guides: featuredGuides }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching featured guides'
    });
  }
};

export const getPopularGuides = async (req: Request, res: Response) => {
  try {
    const popularGuides = [...mockPlantGuides]
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);
    
    res.json({
      status: 'success',
      data: { guides: popularGuides }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching popular guides'
    });
  }
};

export const searchPlantGuides = async (req: Request, res: Response) => {
  try {
    const { q, tags } = req.query;
    
    let results = [...mockPlantGuides];
    
    if (q) {
      const query = (q as string).toLowerCase();
      results = results.filter(guide => 
        guide.plantName.en.toLowerCase().includes(query) ||
        guide.plantName.mm.toLowerCase().includes(query) ||
        guide.description.en.toLowerCase().includes(query) ||
        guide.description.mm.toLowerCase().includes(query) ||
        guide.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    if (tags) {
      const tagArray = (tags as string).split(',').map(tag => tag.trim().toLowerCase());
      results = results.filter(guide => 
        guide.tags.some(tag => tagArray.includes(tag.toLowerCase()))
      );
    }
    
    res.json({
      status: 'success',
      data: { guides: results }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error searching plant guides'
    });
  }
};

export const createPlantGuide = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const guideData = req.body;
    
    // In a real application, you would validate the data and save to database
    const newGuide: PlantGuide = {
      _id: `guide${Date.now()}`,
      ...guideData,
      createdBy: userId,
      featured: false,
      views: 0,
      ratings: {
        average: 0,
        count: 0,
        userRatings: []
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    mockPlantGuides.push(newGuide);
    
    res.status(201).json({
      status: 'success',
      data: { guide: newGuide }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error creating plant guide'
    });
  }
};

export const updatePlantGuide = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId;
    const updates = req.body;
    
    const guideIndex = mockPlantGuides.findIndex(g => g._id === id);
    
    if (guideIndex === -1) {
      return res.status(404).json({
        status: 'error',
        message: 'Plant guide not found'
      });
    }
    
    const guide = mockPlantGuides[guideIndex];
    
    // Check if user owns the guide (or is admin)
    if (guide.createdBy !== userId) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to update this guide'
      });
    }
    
    // Update guide
    mockPlantGuides[guideIndex] = {
      ...guide,
      ...updates,
      updatedAt: new Date()
    };
    
    res.json({
      status: 'success',
      data: { guide: mockPlantGuides[guideIndex] }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error updating plant guide'
    });
  }
};

export const deletePlantGuide = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId;
    
    const guideIndex = mockPlantGuides.findIndex(g => g._id === id);
    
    if (guideIndex === -1) {
      return res.status(404).json({
        status: 'error',
        message: 'Plant guide not found'
      });
    }
    
    const guide = mockPlantGuides[guideIndex];
    
    // Check if user owns the guide (or is admin)
    if (guide.createdBy !== userId) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to delete this guide'
      });
    }
    
    // Delete guide
    mockPlantGuides.splice(guideIndex, 1);
    
    res.json({
      status: 'success',
      message: 'Plant guide deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error deleting plant guide'
    });
  }
};

export const ratePlantGuide = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId;
    const { rating } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        status: 'error',
        message: 'Rating must be between 1 and 5'
      });
    }
    
    const guide = mockPlantGuides.find(g => g._id === id);
    
    if (!guide) {
      return res.status(404).json({
        status: 'error',
        message: 'Plant guide not found'
      });
    }
    
    // Check if user has already rated
    const existingRatingIndex = guide.ratings.userRatings.findIndex(r => r.userId === userId);
    
    if (existingRatingIndex >= 0) {
      // Update existing rating
      guide.ratings.userRatings[existingRatingIndex].rating = rating;
    } else {
      // Add new rating
      guide.ratings.userRatings.push({ userId, rating });
      guide.ratings.count += 1;
    }
    
    // Recalculate average
    const totalRating = guide.ratings.userRatings.reduce((sum, r) => sum + r.rating, 0);
    guide.ratings.average = totalRating / guide.ratings.userRatings.length;
    
    res.json({
      status: 'success',
      data: { 
        rating: guide.ratings.average,
        count: guide.ratings.count
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error rating plant guide'
    });
  }
};
