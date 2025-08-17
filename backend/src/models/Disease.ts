import mongoose, { Schema, Document } from 'mongoose';

export interface IDisease extends Document {
  classIndex: number;
  name: {
    en: string;
    my: string;
  };
  description: {
    en: string;
    my: string;
  };
  symptoms: Array<{
    en: string;
    my: string;
  }>;
  plantType: {
    en: string;
    my: string;
  };
  treatments: Array<{
    name: {
      en: string;
      my: string;
    };
    description: {
      en: string;
      my: string;
    };
    steps: Array<{
      en: string;
      my: string;
    }>;
  }>;
  recommendations: Array<{
    en: string;
    my: string;
  }>;
}

const DiseaseSchema = new Schema<IDisease>({
  classIndex: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    en: { type: String, required: true },
    my: { type: String, required: true }
  },
  description: {
    en: { type: String, required: true },
    my: { type: String, required: true }
  },
  symptoms: [{
    en: { type: String, required: true },
    my: { type: String, required: true }
  }],
  plantType: {
    en: { type: String, required: true },
    my: { type: String, required: true }
  },
  treatments: [{
    name: {
      en: { type: String, required: true },
      my: { type: String, required: true }
    },
    description: {
      en: { type: String, required: true },
      my: { type: String, required: true }
    },
    steps: [{
      en: { type: String, required: true },
      my: { type: String, required: true }
    }]
  }],
  recommendations: [{
    en: { type: String, required: true },
    my: { type: String, required: true }
  }]
}, {
  timestamps: true
});

DiseaseSchema.index({ classIndex: 1 });

const Disease = mongoose.model<IDisease>('Disease', DiseaseSchema);
export default Disease;