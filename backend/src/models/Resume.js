import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema(
  {
    company: { type: String, default: '' },
    role: { type: String, default: '' },
    location: { type: String, default: '' },
    startDate: { type: String, default: '' },
    endDate: { type: String, default: '' },
    isCurrent: { type: Boolean, default: false },
    bullets: [{ type: String }],
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
    techStack: { type: String, default: '' },
    description: { type: String, default: '' },
    link: { type: String, default: '' },
    bullets: [{ type: String }],
  },
  { _id: false }
);

const educationSchema = new mongoose.Schema(
  {
    college: { type: String, default: '' },
    degree: { type: String, default: '' },
    graduationYear: { type: String, default: '' },
    cgpa: { type: String, default: '' },
  },
  { _id: false }
);

const certificationSchema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
    issuer: { type: String, default: '' },
    year: { type: String, default: '' },
  },
  { _id: false }
);

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    // Target Job
    targetRole: { type: String, default: '' },
    targetCompany: { type: String, default: '' },
    jobDescription: { type: String, default: '' },
    experienceLevel: { type: String, default: 'Fresher' },

    // Contact info
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    portfolio: { type: String, default: '' },

    // Core content
    summary: { type: String, default: '' },
    skills: [{ type: String }],
    education: [educationSchema],
    experience: [experienceSchema],
    projects: [projectSchema],
    certifications: [certificationSchema],
    achievements: [{ type: String }],

    // ATS Results
    atsScore: { type: Number, default: 0 },
    atsBreakdown: {
      keywordMatch: { type: Number, default: 0 },
      skillsCoverage: { type: Number, default: 0 },
      sectionCompleteness: { type: Number, default: 0 },
      actionVerbs: { type: Number, default: 0 },
      quantification: { type: Number, default: 0 },
      formattingSafety: { type: Number, default: 10 },
    },
    keywordsMatched: [{ type: String }],
    keywordsMissed: [{ type: String }],
    suggestions: [{ type: String }],

    // Storage
    pdfFileName: { type: String, default: '' },
    pdfRelativePath: { type: String, default: '' },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        ret.id = String(ret._id);
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

const Resume = mongoose.model('Resume', resumeSchema);

export default Resume;
