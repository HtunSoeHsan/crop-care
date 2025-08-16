import mongoose, { Document, Schema } from 'mongoose';

// Flexible multilingual text type - can accept string or object
export interface FlexibleMultilingualText {
  en: string;
  my: string;
}

// Validation function for multilingual text
export function validateMultilingualText(value: any): boolean {
  // Accept string (will be converted to multilingual)
  if (typeof value === 'string' && value.trim().length > 0) {
    return true;
  }
  
  // Accept object with en and my properties
  if (typeof value === 'object' && value !== null && 
      typeof value.en === 'string' && value.en.trim().length > 0 &&
      typeof value.my === 'string' && value.my.trim().length > 0) {
    return true;
  }
  
  return false;
}

// Convert any value to multilingual text
export function toMultilingualText(value: any): FlexibleMultilingualText {
  if (typeof value === 'string') {
    return {
      en: value,
      my: value // Default fallback, can be updated later
    };
  }
  
  if (typeof value === 'object' && value !== null && value.en && value.my) {
    return {
      en: value.en,
      my: value.my
    };
  }
  
  // Fallback
  return {
    en: 'Unknown',
    my: 'Tidak Diketahui'
  };
}

// Plant Disease Model with flexible multilingual support
export interface IPlantDisease extends Document {
  _id: string;
  classIndex: number;
  name: { en: string; my: string };
  description: { en: string; my: string };
  symptoms: { en: string; my: string }[];
  plantType: { en: string; my: string };
  treatments: { en: string; my: string }[];
  severity: 'low' | 'medium' | 'high';
  prevention?: { en: string; my: string }[];
  causes?: { en: string; my: string }[];
  scientificName?: string;
  imageUrls?: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const plantDiseaseSchema = new Schema<IPlantDisease>({
  classIndex: { type: Number, required: true, unique: true },
  name: { type: Schema.Types.Mixed, required: true, validate: validateMultilingualText },
  description: { type: Schema.Types.Mixed, required: true, validate: validateMultilingualText },
  symptoms: [{ type: Schema.Types.Mixed, validate: validateMultilingualText }],
  plantType: { type: Schema.Types.Mixed, required: true, validate: validateMultilingualText },
  treatments: [{ type: Schema.Types.Mixed, validate: validateMultilingualText }],
  
  prevention: [{ type: Schema.Types.Mixed, validate: validateMultilingualText }],
  causes: [{ type: Schema.Types.Mixed, validate: validateMultilingualText }],
  
  scientificName: String,
  imageUrls: [String],
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

// Plant Care Guide Model
export interface IPlantCareGuide extends Document {
  _id: string;
  plantName: { en: string; my: string };
  scientificName: string;
  plantType: { en: string; my: string };
  description: { en: string; my: string };
  images: string[];
  careInstructions: {
    watering: {
      frequency: { en: string; my: string };
      amount: { en: string; my: string };
      tips: { en: string; my: string }[];
    };
    sunlight: {
      requirement: { en: string; my: string };
      hours: { en: string; my: string };
      tips: { en: string; my: string }[];
    };
    soil: {
      type: { en: string; my: string };
      pH: string;
      drainage: { en: string; my: string };
      tips: { en: string; my: string }[];
    };
    fertilizing: {
      frequency: { en: string; my: string };
      type: { en: string; my: string };
      tips: { en: string; my: string }[];
    };
  };
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  createdBy: string;
  featured: boolean;
  views: number;
  ratings: {
    average: number;
    count: number;
    userRatings: {
      userId: string;
      rating: number;
      createdAt: Date;
    }[];
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const plantCareGuideSchema = new Schema<IPlantCareGuide>({
  plantName: { type: Schema.Types.Mixed, required: true, validate: validateMultilingualText },
  scientificName: { type: String, required: true },
  plantType: { type: Schema.Types.Mixed, required: true, validate: validateMultilingualText },
  description: { type: Schema.Types.Mixed, required: true, validate: validateMultilingualText },
  images: [String],
  careInstructions: {
    watering: {
      frequency: { type: Schema.Types.Mixed, required: true, validate: validateMultilingualText },
      amount: { type: Schema.Types.Mixed, required: true, validate: validateMultilingualText },
      tips: [{ type: Schema.Types.Mixed, required: true, validate: validateMultilingualText }]
    },
    sunlight: {
      requirement: { type: Schema.Types.Mixed, required: true, validate: validateMultilingualText },
      hours: { type: Schema.Types.Mixed, required: true, validate: validateMultilingualText },
      tips: [{ type: Schema.Types.Mixed, required: true, validate: validateMultilingualText }]
    },
    soil: {
      type: { type: Schema.Types.Mixed, required: true, validate: validateMultilingualText },
      pH: String,
      drainage: { type: Schema.Types.Mixed, required: true, validate: validateMultilingualText },
      tips: [{ type: Schema.Types.Mixed, required: true, validate: validateMultilingualText }]
    },
    fertilizing: {
      frequency: { type: Schema.Types.Mixed, required: true, validate: validateMultilingualText },
      type: { type: Schema.Types.Mixed, required: true, validate: validateMultilingualText },
      tips: [{ type: Schema.Types.Mixed, required: true, validate: validateMultilingualText }]
    }
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  tags: [String],
  createdBy: { type: String, required: true, ref: 'User' },
  featured: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
    userRatings: [{
      userId: { type: String, required: true },
      rating: { type: Number, required: true, min: 1, max: 5 },
      createdAt: { type: Date, default: Date.now }
    }]
  },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

// User Model
export interface IUser extends Document {
  _id: string;
  email: string;
  imageUrl?: string;
  password: string;
  name: string;
  role: 'user' | 'expert' | 'admin';
  preferredLanguage: 'en' | 'my';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  imageUrl: { type: String, default: '' },
  name: { type: String, required: true },
  role: { type: String, enum: ['user', 'expert', 'admin'], default: 'user' },
  preferredLanguage: { type: String, enum: ['en', 'my'], default: 'en' },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

// Indexes for better performance
plantDiseaseSchema.index({ 'name.en': 'text', 'name.my': 'text', 'description.en': 'text', 'description.my': 'text' });
plantCareGuideSchema.index({ 'plantName.en': 'text', 'plantName.my': 'text', 'description.en': 'text', 'description.my': 'text' });

// Create models
export const PlantDisease = mongoose.model<IPlantDisease>('PlantDisease', plantDiseaseSchema);
export const PlantCareGuide = mongoose.model<IPlantCareGuide>('PlantCareGuide', plantCareGuideSchema);
export const User = mongoose.model<IUser>('User', userSchema);

// Utility functions for multilingual text handling
export const MultilingualUtils = {
  // Get text in preferred language with fallback
  getText: (multilingualText: any, language: 'en' | 'my' = 'en'): string => {
    if (!multilingualText) return '';
    
    // If it's a string, return as-is
    if (typeof multilingualText === 'string') {
      return multilingualText;
    }
    
    // If it's an object, return the preferred language or fallback
    if (typeof multilingualText === 'object') {
      return multilingualText[language] || multilingualText['en'] || multilingualText['my'] || '';
    }
    
    return '';
  },

  // Check if text is properly multilingual
  isMultilingual: (text: any): boolean => {
    return typeof text === 'object' && 
           text !== null && 
           typeof text.en === 'string' && 
           typeof text.my === 'string' &&
           text.en.trim().length > 0 &&
           text.my.trim().length > 0;
  },

  // Convert string to multilingual object
  stringToMultilingual: (text: string): { en: string; my: string } => {
    return {
      en: text,
      my: text // Default fallback
    };
  }
};

// Normalize multilingual text (convert string to object if needed)
export const normalizeMultilingualText = (text: FlexibleMultilingualText): { en: string; my: string } => {
  if (typeof text === 'string') {
    return { en: text, my: text };
  }
  return text;
};

// Get localized text with fallback
export const getLocalizedText = (text: any, language: 'en' | 'my' = 'en'): string => {
  return MultilingualUtils.getText(text, language);
};

// Default export for backward compatibility
export default {
  PlantDisease,
  PlantCareGuide,
  User,
  MultilingualUtils,
  normalizeMultilingualText,
  getLocalizedText
};
