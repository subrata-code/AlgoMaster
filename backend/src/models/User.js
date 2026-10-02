import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { ACTIVITY_TYPES, ONBOARDING_DIFFICULTIES, ROLES } from '../constants/index.js';

const progressSchema = new mongoose.Schema(
  {
    solved: { type: Number, default: 0 },
    easy: { type: Number, default: 0 },
    medium: { type: Number, default: 0 },
    hard: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastSolvedAt: { type: Date, default: null },
  },
  { _id: false },
);

const activitySchema = new mongoose.Schema(
  {
    type: { type: String, enum: ACTIVITY_TYPES, required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem' },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: false },
);

const solvedProblemSchema = new mongoose.Schema(
  {
    problem: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true },
    difficulty: { type: String },
    topics: [{ type: String }],
    solvedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const onboardingSchema = new mongoose.Schema(
  {
    completed: { type: Boolean, default: false },
    difficultyPreference: { type: String, enum: ONBOARDING_DIFFICULTIES },
    tourCompleted: { type: Boolean, default: false },
  },
  { _id: false },
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [80, 'Name cannot exceed 80 characters'],
    },
    username: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: [40, 'Username cannot exceed 40 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [
        function () {
          return this.provider === 'local';
        },
        'Password is required',
      ],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      select: false,
    },
    emailVerificationExpires: {
      type: Date,
      select: false,
    },
    profileImage: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
      maxlength: [400, 'Bio cannot exceed 400 characters'],
    },
    location: {
      type: String,
      default: '',
      maxlength: [80, 'Location cannot exceed 80 characters'],
    },
    github: {
      type: String,
      default: '',
      maxlength: [80, 'GitHub handle cannot exceed 80 characters'],
    },
    linkedin: {
      type: String,
      default: '',
      maxlength: [80, 'LinkedIn handle cannot exceed 80 characters'],
    },
    phone: {
      type: String,
      default: '',
      maxlength: [20, 'Phone number cannot exceed 20 characters'],
    },
    college: {
      type: String,
      default: '',
      maxlength: [120, 'College name cannot exceed 120 characters'],
    },
    degree: {
      type: String,
      default: '',
      maxlength: [80, 'Degree cannot exceed 80 characters'],
    },
    graduationYear: {
      type: String,
      default: '',
      maxlength: [4, 'Graduation year cannot exceed 4 characters'],
    },
    skills: {
      type: [String],
      default: [],
    },
    targetCompanyType: {
      type: String,
      default: '',
      maxlength: [40, 'Target company type cannot exceed 40 characters'],
    },
    targetRole: {
      type: String,
      default: '',
      maxlength: [60, 'Target role cannot exceed 60 characters'],
    },
    portfolio: {
      type: String,
      default: '',
      maxlength: [120, 'Portfolio URL cannot exceed 120 characters'],
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.USER,
    },
    bookmarks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem',
      },
    ],
    solvedProblems: {
      type: [solvedProblemSchema],
      default: [],
    },
    activities: {
      type: [activitySchema],
      default: [],
    },
    progress: {
      type: progressSchema,
      default: () => ({}),
    },
    onboarding: {
      type: onboardingSchema,
      default: () => ({}),
    },
    provider: {
      type: String,
      enum: ['local', 'google', 'github'],
      default: 'local',
    },
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpire: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        ret.id = String(ret._id);
        delete ret.password;
        delete ret.resetPasswordToken;
        delete ret.resetPasswordExpire;
        delete ret.__v;
        return ret;
      },
    },
  },
);

userSchema.pre('save', async function hashPassword() {
  if (this.isModified('email') && !this.username) {
    this.username = this.email.split('@')[0];
  }

  if (!this.isModified('password') || !this.password) {
    return;
  }

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.pushActivity = function pushActivity(activity) {
  this.activities.unshift({
    ...activity,
    timestamp: activity.timestamp || new Date(),
  });
  this.activities = this.activities.slice(0, 50);
};

const User = mongoose.model('User', userSchema);

export default User;
