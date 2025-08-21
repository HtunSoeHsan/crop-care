import mongoose, { Document, Schema } from 'mongoose';

export interface IDisease extends Document {
  classIndex?: number;
  name: {
    en: string;
    my: string;
  };
  description: {
    en: string;
    my: string;
  };
  symptoms: {
    en: string;
    my: string;
  };
  causes: {
    en: string;
    my: string;
  };
  treatment: {
    en: string;
    my: string;
  };
  prevention: {
    en: string;
    my: string;
  };
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  affectedCrops: {
    en: string;
    my: string;
  };
  imageUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DiseaseSchema: Schema = new Schema({
  classIndex: {
    type: Number,
    unique: true,
    sparse: true
  },
  name: {
    en: { type: String, required: true, trim: true },
    my: { type: String, required: true, trim: true }
  },
  description: {
    en: { type: String, required: true, trim: true },
    my: { type: String, required: true, trim: true }
  },
  symptoms: {
    en: { type: String, required: true, trim: true },
    my: { type: String, required: true, trim: true }
  },
  causes: {
    en: { type: String, required: true, trim: true },
    my: { type: String, required: true, trim: true }
  },
  treatment: {
    en: { type: String, required: true, trim: true },
    my: { type: String, required: true, trim: true }
  },
  prevention: {
    en: { type: String, required: true, trim: true },
    my: { type: String, required: true, trim: true }
  },
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    required: true
  },
  affectedCrops: {
    en: { type: String, required: true, trim: true },
    my: { type: String, required: true, trim: true }
  },
  imageUrl: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model<IDisease>('Disease', DiseaseSchema);