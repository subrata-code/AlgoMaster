import mongoose from 'mongoose';
import { DIFFICULTIES, PLATFORMS, PROBLEM_STATUS } from '../constants/index.js';

const problemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Problem name is required'],
      trim: true,
      maxlength: [160, 'Name cannot exceed 160 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    day: {
      type: Number,
      min: 1,
      max: 100,
    },
    difficulty: {
      type: String,
      enum: DIFFICULTIES,
      required: true,
    },
    platform: {
      type: String,
      enum: PLATFORMS,
      required: true,
    },
    link: {
      type: String,
      required: [true, 'Problem link is required'],
      trim: true,
    },
    companies: [{ type: String, trim: true }],
    tags: [{ type: String, trim: true }],
    topics: [{ type: String, trim: true, lowercase: true }],
    hints: [{ type: String, trim: true }],
    solution: { type: String, default: '' },
    conceptVideoUrl: { type: String, default: '' },
    description: { type: String, default: '' },
    isPremium: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    status: {
      type: String,
      enum: PROBLEM_STATUS,
      default: 'draft',
      index: true,
    },
    solvedCount: { type: Number, default: 0, min: 0 },
    acceptanceRate: { type: Number, default: 0, min: 0, max: 100 },
    viewCount: { type: Number, default: 0, min: 0 },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        ret.id = String(ret._id);
        delete ret.__v;
        return ret;
      },
    },
  },
);

problemSchema.index({ name: 'text', tags: 'text', companies: 'text' });
problemSchema.index({ difficulty: 1, platform: 1, status: 1 });
problemSchema.index({ day: 1 });

const Problem = mongoose.model('Problem', problemSchema);

export default Problem;
