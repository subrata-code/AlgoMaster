import mongoose from 'mongoose';

const EVENT_TYPES = [
  'problem_opened',
  'video_opened',
  'solution_viewed',
  'hint_0_viewed',
  'hint_1_viewed',
  'hint_2_viewed',
];

const problemEventSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    problem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem',
      required: true,
    },
    eventType: {
      type: String,
      enum: EVENT_TYPES,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        ret.id = String(ret._id);
        delete ret.__v;
        return ret;
      },
    },
  },
);

// Compound index for fast lookups
problemEventSchema.index({ user: 1, problem: 1, eventType: 1 });
// Auto-delete events older than 90 days
problemEventSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 86400 });

const ProblemEvent = mongoose.model('ProblemEvent', problemEventSchema);

export default ProblemEvent;
