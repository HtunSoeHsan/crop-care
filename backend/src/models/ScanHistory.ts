import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IScanHistory extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  imageUrl: string;
  imagePath: string;
  results: {
    classIndex: number;
    name: {
      en: string;
      my: string;
    };
    confidence: string;
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
  }[];
  primaryResult: {
    classIndex: number;
    name: {
      en: string;
      my: string;
    };
    confidence: string;
  };
  isHealthy: boolean;
  confidence: number;
  createdAt: Date;
  updatedAt: Date;
}

const ScanHistorySchema = new Schema<IScanHistory>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  imagePath: {
    type: String,
    required: true
  },
  results: [{
    classIndex: { type: Number, required: true },
    name: {
      en: { type: String, required: true },
      my: { type: String, required: true }
    },
    confidence: { type: String, required: true },
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
    }]
  }],
  primaryResult: {
    classIndex: { type: Number, required: true },
    name: {
      en: { type: String, required: true },
      my: { type: String, required: true }
    },
    confidence: { type: String, required: true }
  },
  isHealthy: {
    type: Boolean,
    required: true
  },
  confidence: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

ScanHistorySchema.index({ userId: 1, createdAt: -1 });

const ScanHistory = mongoose.model<IScanHistory>('ScanHistory', ScanHistorySchema);
export default ScanHistory;