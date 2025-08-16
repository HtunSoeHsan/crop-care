import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IPlantDisease extends Document {
  _id: Types.ObjectId;
  name: string;
  description: string;
  symptoms: string[];
  plantType: string;
  classIndex?: number;
  createdAt: Date;
  updatedAt: Date;
}

const PlantDiseaseSchema = new Schema<IPlantDisease>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  symptoms: {
    type: [String],
    default: []
  },
  plantType: {
    type: String,
    required: true,
    trim: true
  },
  classIndex: {
    type: Number,
    unique: true,
    sparse: true // allows multiple null values
  }
}, {
  timestamps: true
});

// Create indexes
PlantDiseaseSchema.index({ name: 1 });
PlantDiseaseSchema.index({ plantType: 1 });
PlantDiseaseSchema.index({ classIndex: 1 });

const PlantDisease = mongoose.model<IPlantDisease>('PlantDisease', PlantDiseaseSchema);
export default PlantDisease;
