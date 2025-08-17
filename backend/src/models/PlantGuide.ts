import mongoose, { Schema, Document } from 'mongoose';

export interface IPlantGuide extends Document {
  plantName: {
    en: string;
    my: string;
  };
  scientificName?: string;
  category: string;
  description: {
    en: string;
    my: string;
  };
  careInstructions: {
    watering: {
      en: string;
      my: string;
    };
    sunlight: {
      en: string;
      my: string;
    };
    soil: {
      en: string;
      my: string;
    };
  };
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  featured: boolean;
  views: number;
}

const PlantGuideSchema = new Schema<IPlantGuide>({
  plantName: {
    en: { type: String, required: true },
    my: { type: String, required: true }
  },
  scientificName: { type: String },
  category: { type: String, required: true },
  description: {
    en: { type: String, required: true },
    my: { type: String, required: true }
  },
  careInstructions: {
    watering: {
      en: { type: String, required: true },
      my: { type: String, required: true }
    },
    sunlight: {
      en: { type: String, required: true },
      my: { type: String, required: true }
    },
    soil: {
      en: { type: String, required: true },
      my: { type: String, required: true }
    }
  },
  tags: [{ type: String }],
  difficulty: { 
    type: String, 
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  featured: { type: Boolean, default: false },
  views: { type: Number, default: 0 }
}, {
  timestamps: true
});

PlantGuideSchema.index({ 'plantName.en': 'text', 'plantName.my': 'text', 'description.en': 'text', 'description.my': 'text' });
PlantGuideSchema.index({ category: 1 });
PlantGuideSchema.index({ tags: 1 });

const PlantGuide = mongoose.model<IPlantGuide>('PlantGuide', PlantGuideSchema);
export default PlantGuide;