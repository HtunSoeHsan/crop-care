import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IForumPost extends Document {
  _id: Types.ObjectId;
  title: string;
  content: string;
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IForumReply extends Document {
  _id: Types.ObjectId;
  content: string;
  userId: Types.ObjectId;
  postId: Types.ObjectId;
  upvotes: number;
  downvotes: number;
  createdAt: Date;
  updatedAt: Date;
}

const ForumPostSchema = new Schema<IForumPost>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const ForumReplySchema = new Schema<IForumReply>({
  content: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  postId: {
    type: Schema.Types.ObjectId,
    ref: 'ForumPost',
    required: true
  },
  upvotes: {
    type: Number,
    default: 0,
    min: 0
  },
  downvotes: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

// Create indexes
ForumPostSchema.index({ userId: 1 });
ForumPostSchema.index({ createdAt: -1 });
ForumPostSchema.index({ title: 'text', content: 'text' });

ForumReplySchema.index({ postId: 1 });
ForumReplySchema.index({ userId: 1 });
ForumReplySchema.index({ createdAt: -1 });

export const ForumPost = mongoose.model<IForumPost>('ForumPost', ForumPostSchema);
export const ForumReply = mongoose.model<IForumReply>('ForumReply', ForumReplySchema);
