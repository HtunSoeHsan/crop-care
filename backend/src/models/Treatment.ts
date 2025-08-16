import mongoose, { Schema, Document, Types } from 'mongoose';

export enum TreatmentType {
  ORGANIC = 'ORGANIC',
  CHEMICAL = 'CHEMICAL',
  PREVENTIVE = 'PREVENTIVE'
}

export interface ITreatment extends Document {
  _id: Types.ObjectId;
  diseaseId: Types.ObjectId;
  name: string;
  description: string;
  steps: string[];
  type?: TreatmentType;
  createdAt: Date;
  updatedAt: Date;
}

const TreatmentSchema = new Schema<ITreatment>({
  diseaseId: {
    type: Schema.Types.ObjectId,
    ref: 'PlantDisease',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  steps: {
    type: [String],
    default: []
  },
  type: {
    type: String,
    enum: Object.values(TreatmentType),
    default: TreatmentType.ORGANIC
  }
}, {
  timestamps: true
});

// Create indexes
TreatmentSchema.index({ diseaseId: 1 });
TreatmentSchema.index({ type: 1 });

const Treatment = mongoose.model<ITreatment>('Treatment', TreatmentSchema);
export default Treatment;
