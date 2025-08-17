import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IScanHistory extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  classIndex: number;
  confidence: string;
  isHealthy: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ScanHistorySchema = new Schema<IScanHistory>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  classIndex: {
    type: Number,
    required: true
  },
  confidence: {
    type: String,
    required: true
  },
  isHealthy: {
    type: Boolean,
    required: true
  }
}, {
  timestamps: true
});

ScanHistorySchema.index({ userId: 1, createdAt: -1 });

const ScanHistory = mongoose.model<IScanHistory>('ScanHistory', ScanHistorySchema);
export default ScanHistory;