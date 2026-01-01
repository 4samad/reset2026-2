import mongoose, { Schema, Model, models } from 'mongoose';

export interface IUser {
  email: string;
  username: string;
  createdAt: Date;
  dateJoined?: Date; // Date of first check-in
  currentDay: number;
  whatsappOptIn: boolean;
  whatsappNumber?: string;
  mentorCheckInOptIn: boolean;
  age?: number;
  gender?: string;
  goal?: string;
  preferredLanguage?: 'English' | 'Malayalam';
  onboardingCompleted: boolean;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    dateJoined: {
      type: Date,
    },
    currentDay: {
      type: Number,
      default: 0,
      min: 0,
      max: 30,
    },
    whatsappOptIn: {
      type: Boolean,
      default: false,
    },
    whatsappNumber: {
      type: String,
      trim: true,
      validate: {
        validator: function (v: string) {
          // Validate phone number format (optional field)
          if (!v) return true;
          return /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/.test(
            v
          );
        },
        message: 'Invalid phone number format',
      },
    },
    mentorCheckInOptIn: {
      type: Boolean,
      default: false,
    },
    age: {
      type: Number,
      min: 13,
      max: 120,
    },
    gender: {
      type: String,
      trim: true,
    },
    goal: {
      type: String,
      trim: true,
    },
    preferredLanguage: {
      type: String,
      enum: ['English', 'Malayalam'],
      default: 'English',
    },
    onboardingCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Prevent model recompilation in development (Next.js hot reload)
const User: Model<IUser> =
  models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
