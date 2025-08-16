import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IDetection extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  diseaseId: Types.ObjectId;
  imageUrl: string;
  confidence: number;
  createdAt: Date;
  updatedAt: Date;
}

const DetectionSchema = new Schema<IDetection>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  diseaseId: {
    type: Schema.Types.ObjectId,
    ref: 'PlantDisease',
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 1
  }
}, {
  timestamps: true
});

// Create indexes
DetectionSchema.index({ userId: 1 });
DetectionSchema.index({ diseaseId: 1 });
DetectionSchema.index({ confidence: -1 });
DetectionSchema.index({ createdAt: -1 });

const Detection = mongoose.model<IDetection>('Detection', DetectionSchema);
export default Detection;
