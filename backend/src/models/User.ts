import mongoose, { Schema, Document, Types } from 'mongoose';

export enum UserRole {
  USER = 'USER',
  EXPERT = 'EXPERT',
  ADMIN = 'ADMIN'
}

export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  name?: string;
  password: string;
  role: UserRole;
  profileImage?: string;
  googleId?: string;
  firstName?: string;
  lastName?: string;
  locale?: string;
  isGoogleUser?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.USER
  },
  profileImage: {
    type: String,
    trim: true
  },
  googleId: {
    type: String,
    trim: true,
    sparse: true
  },
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  locale: {
    type: String,
    trim: true
  },
  isGoogleUser: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Create indexes
UserSchema.index({ email: 1 });
UserSchema.index({ googleId: 1 });

const User = mongoose.model<IUser>('User', UserSchema);
export default User;
