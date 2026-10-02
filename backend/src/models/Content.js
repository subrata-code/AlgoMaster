import mongoose from 'mongoose';
import { CONTENT_TYPES } from '../constants/index.js';

const contentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: CONTENT_TYPES,
      required: true,
      index: true,
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    order: {
      type: Number,
      default: 0,
    },
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

contentSchema.index({ type: 1, slug: 1 });
contentSchema.index({ type: 1, order: 1 });

const Content = mongoose.model('Content', contentSchema);

export default Content;
