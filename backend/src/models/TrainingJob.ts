import mongoose, { Document, Schema } from 'mongoose';

export interface ITrainingJob extends Document {
  id: string;
  datasetPath: string;
  datasetName: string;
  classIndices: { [key: string]: number };
  status: 'pending' | 'running' | 'completed' | 'failed' | 'stopped';
  progress: number;
  logs: string[];
  startTime?: Date;
  endTime?: Date;
  accuracy?: number;
  epochs: number;
  batchSize: number;
  learningRate: number;
  modelPath?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TrainingJobSchema = new Schema<ITrainingJob>({
  datasetPath: { type: String, required: true },
  datasetName: { type: String, required: true },
  classIndices: { type: Map, of: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'running', 'completed', 'failed', 'stopped'],
    default: 'pending'
  },
  progress: { type: Number, default: 0 },
  logs: [{ type: String }],
  startTime: { type: Date },
  endTime: { type: Date },
  accuracy: { type: Number },
  epochs: { type: Number, required: true },
  batchSize: { type: Number, required: true },
  learningRate: { type: Number, required: true },
  modelPath: { type: String }
}, {
  timestamps: true
});

export const TrainingJob = mongoose.model<ITrainingJob>('TrainingJob', TrainingJobSchema);