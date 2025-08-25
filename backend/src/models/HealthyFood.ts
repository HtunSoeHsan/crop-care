import mongoose, { Document, Schema } from 'mongoose';

export interface IHealthyFood extends Document {
  title: {
    en: string;
    my: string;
  };
  description: {
    en: string;
    my: string;
  };
  imageUrl?: string;
  keyBenefits: {
    en: string[];
    my: string[];
  };
  keyNutrients: {
    en: string[];
    my: string[];
  };
  season: string;
  category: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const HealthyFoodSchema: Schema = new Schema({
  title: {
    en: { type: String, required: true, trim: true },
    my: { type: String, required: true, trim: true }
  },
  description: {
    en: { type: String, required: true, trim: true },
    my: { type: String, required: true, trim: true }
  },
  imageUrl: {
    type: String,
    trim: true
  },
  keyBenefits: {
    en: [{ type: String, required: true, trim: true }],
    my: [{ type: String, required: true, trim: true }]
  },
  keyNutrients: {
    en: [{ type: String, required: true, trim: true }],
    my: [{ type: String, required: true, trim: true }]
  },
  season: {
    type: String,
    required: true,
    enum: ['Spring', 'Summer', 'Fall', 'Winter', 'Year-round']
  },
  category: {
    type: String,
    required: true,
    enum: ['Fruits', 'Vegetables', 'Grains', 'Proteins', 'Dairy', 'Nuts & Seeds']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model<IHealthyFood>('HealthyFood', HealthyFoodSchema);