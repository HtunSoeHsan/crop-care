import mongoose, { Schema, Document } from 'mongoose';

export interface IHealthyFood extends Document {
  name: {
    en: string;
    my: string;
  };
  category: string;
  nutrients: string[];
  benefits: {
    en: string;
    my: string;
  };
  season: string;
  tags: string[];
  featured: boolean;
  views: number;
}

const HealthyFoodSchema = new Schema<IHealthyFood>({
  name: {
    en: { type: String, required: true },
    my: { type: String, required: true }
  },
  category: { type: String, required: true },
  nutrients: [{ type: String }],
  benefits: {
    en: { type: String, required: true },
    my: { type: String, required: true }
  },
  season: { type: String, required: true },
  tags: [{ type: String }],
  featured: { type: Boolean, default: false },
  views: { type: Number, default: 0 }
}, {
  timestamps: true
});

HealthyFoodSchema.index({ 'name.en': 'text', 'name.my': 'text', 'benefits.en': 'text', 'benefits.my': 'text' });
HealthyFoodSchema.index({ category: 1 });
HealthyFoodSchema.index({ season: 1 });
HealthyFoodSchema.index({ nutrients: 1 });

const HealthyFood = mongoose.model<IHealthyFood>('HealthyFood', HealthyFoodSchema);
export default HealthyFood;