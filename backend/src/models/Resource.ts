import mongoose, { Document, Schema } from 'mongoose';

export interface IResource extends Document {
  title: string;
  description: string;
  type: 'article' | 'video' | 'guide' | 'community';
  category: string;
  image: string;
  content?: string;
  videoUrl?: string;
  pdfUrl?: string;
  readTime?: string;
  duration?: string;
  tags: string[];
  linkUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ResourceSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['article', 'video', 'guide', 'community'],
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true
  },
  content: {
    type: String,
    trim: true
  },
  videoUrl: {
    type: String,
    trim: true
  },
  pdfUrl: {
    type: String,
    trim: true
  },
  readTime: {
    type: String,
    trim: true
  },
  duration: {
    type: String,
    trim: true
  },
  linkUrl: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model<IResource>('Resource', ResourceSchema);