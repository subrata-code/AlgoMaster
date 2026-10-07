import fs from 'fs';
import path from 'path';
import Resume from '../models/Resume.js';
import User from '../models/User.js';
import { generateResumeWithPython, parseJobDescriptionWithPython } from '../services/resumePythonService.js';
import { asyncHandler, sendSuccess, AppError } from '../utils/helpers.js';
import { HTTP_STATUS } from '../constants/index.js';

// Storage directory for generated resumes
const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads', 'resumes');

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * GET /api/resume/prefill
 * Prefills wizard with all existing data from user profile
 */
export const prefill = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).lean();
  if (!user) {
    throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
  }

  // Pre-fill fields from profile
  const prefillData = {
    fullName: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    location: user.location || '',
    github: user.github ? (user.github.startsWith('http') ? user.github : `https://github.com/${user.github}`) : '',
    linkedin: user.linkedin ? (user.linkedin.startsWith('http') ? user.linkedin : `https://linkedin.com/in/${user.linkedin}`) : '',
    portfolio: user.portfolio || '',
    targetRole: user.targetRole || '',
    targetCompany: user.targetCompanyType || '',
    skills: Array.isArray(user.skills) ? user.skills : [],
    education: user.college
      ? [
          {
            college: user.college,
            degree: user.degree || '',
            graduationYear: user.graduationYear || '',
            cgpa: '',
          },
        ]
      : [],
    // Empty defaults for sections requiring gap questions
    experience: [],
    projects: [],
    certifications: [],
    achievements: [],
    summary: user.bio || '',
  };

  sendSuccess(res, { data: prefillData });
});

/**
 * POST /api/resume/parse-jd
 * Parse job description using Python NLP without generating full PDF
 */
export const parseJD = asyncHandler(async (req, res) => {
  const { jobDescription, targetRole } = req.body;
  const result = await parseJobDescriptionWithPython(jobDescription || '', targetRole || '');
  sendSuccess(res, { data: result });
});

/**
 * POST /api/resume/generate
 * Generates ATS-optimized resume, saves to DB and disk
 */
export const generate = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const payload = req.body;

  if (!payload.fullName || !payload.email) {
    throw new AppError('Full name and email are required', HTTP_STATUS.BAD_REQUEST);
  }

  // Call local offline Python engine
  const pythonResult = await generateResumeWithPython(payload);

  const {
    atsScore,
    atsBreakdown,
    keywordsMatched,
    keywordsMissed,
    suggestions,
    optimizedData,
    pdfBase64,
  } = pythonResult;

  // Save PDF to local disk
  const userDir = path.join(UPLOADS_DIR, String(userId));
  ensureDir(userDir);

  const timestamp = Date.now();
  const fileName = `resume_${timestamp}.pdf`;
  const filePath = path.join(userDir, fileName);

  if (pdfBase64) {
    const pdfBuffer = Buffer.from(pdfBase64, 'base64');
    fs.writeFileSync(filePath, pdfBuffer);
  }

  // Save record to MongoDB
  const resumeRecord = await Resume.create({
    user: userId,
    targetRole: payload.targetRole || '',
    targetCompany: payload.targetCompany || '',
    jobDescription: payload.jobDescription || '',
    experienceLevel: payload.experienceLevel || 'Fresher',

    fullName: optimizedData.fullName || payload.fullName,
    email: optimizedData.email || payload.email,
    phone: optimizedData.phone || payload.phone || '',
    location: optimizedData.location || payload.location || '',
    github: optimizedData.github || payload.github || '',
    linkedin: optimizedData.linkedin || payload.linkedin || '',
    portfolio: optimizedData.portfolio || payload.portfolio || '',

    summary: optimizedData.summary || payload.summary || '',
    skills: optimizedData.skills || payload.skills || [],
    education: optimizedData.education || payload.education || [],
    experience: optimizedData.experience || payload.experience || [],
    projects: optimizedData.projects || payload.projects || [],
    certifications: optimizedData.certifications || payload.certifications || [],
    achievements: optimizedData.achievements || payload.achievements || [],

    atsScore: atsScore || 0,
    atsBreakdown: atsBreakdown || {},
    keywordsMatched: keywordsMatched || [],
    keywordsMissed: keywordsMissed || [],
    suggestions: suggestions || [],

    pdfFileName: fileName,
    pdfRelativePath: path.join(String(userId), fileName),
  });

  sendSuccess(res, {
    statusCode: HTTP_STATUS.CREATED,
    message: 'Resume generated successfully',
    data: {
      resume: resumeRecord,
      pdfBase64,
    },
  });
});

/**
 * GET /api/resume/list
 * Retrieves all generated resumes for current authenticated user
 */
export const list = asyncHandler(async (req, res) => {
  const resumes = await Resume.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .lean();

  sendSuccess(res, {
    data: {
      resumes: resumes.map((r) => {
        r.id = String(r._id);
        delete r._id;
        return r;
      }),
    },
  });
});

/**
 * GET /api/resume/:id/download
 * Streams the ATS PDF to user's browser for download
 */
export const download = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!resume || !resume.pdfRelativePath) {
    throw new AppError('Resume not found or PDF missing', HTTP_STATUS.NOT_FOUND);
  }

  const filePath = path.join(UPLOADS_DIR, resume.pdfRelativePath);
  if (!fs.existsSync(filePath)) {
    throw new AppError('PDF file no longer exists on server', HTTP_STATUS.NOT_FOUND);
  }

  const downloadName = `${resume.fullName.replace(/\s+/g, '_')}_Resume_ATS.pdf`;
  res.download(filePath, downloadName);
});

/**
 * DELETE /api/resume/:id
 * Deletes resume record and corresponding PDF file
 */
export const remove = asyncHandler(async (req, res) => {
  const resume = await Resume.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!resume) {
    throw new AppError('Resume not found', HTTP_STATUS.NOT_FOUND);
  }

  if (resume.pdfRelativePath) {
    const filePath = path.join(UPLOADS_DIR, resume.pdfRelativePath);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (e) {
        // file remove error ignored
      }
    }
  }

  sendSuccess(res, { message: 'Resume deleted successfully' });
});
