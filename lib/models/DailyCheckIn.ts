import mongoose, { Schema, Model, models, Types } from 'mongoose';

export interface IDailyCheckIn {
  userId: Types.ObjectId;
  date: string; // YYYY-MM-DD format
  status: 'strong' | 'struggled' | 'relapsed';
  dayNumber: number;
  createdAt: Date;
}

const DailyCheckInSchema = new Schema<IDailyCheckIn>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    date: {
      type: String,
      required: true,
      validate: {
        validator: function (v: string) {
          // Validate YYYY-MM-DD format
          return /^\d{4}-\d{2}-\d{2}$/.test(v);
        },
        message: 'Date must be in YYYY-MM-DD format',
      },
    },
    status: {
      type: String,
      required: true,
      enum: ['strong', 'struggled', 'relapsed'],
    },
    dayNumber: {
      type: Number,
      required: true,
      min: 1,
      max: 30,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Create compound unique index on userId + date
// This ensures each user can only have one check-in per day
DailyCheckInSchema.index({ userId: 1, date: 1 }, { unique: true });

// Prevent model recompilation in development (Next.js hot reload)
const DailyCheckIn: Model<IDailyCheckIn> =
  models.DailyCheckIn ||
  mongoose.model<IDailyCheckIn>('DailyCheckIn', DailyCheckInSchema);

export default DailyCheckIn;
