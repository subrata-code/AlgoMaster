import connectDB from '../config/db.js';
import env from '../config/env.js';
import User from '../models/User.js';
import Problem from '../models/Problem.js';
import Content from '../models/Content.js';
import { ROLES } from '../constants/index.js';
import { PROBLEMS } from '../data/seedProblems.js';
import { TOPICS, COMPANIES, ROADMAP, TESTIMONIALS, FAQS, HOME_STATS } from '../data/seedContent.js';

const focuses = [
  'Arrays & Hashing',
  'Two Pointers',
  'Sliding Window',
  'Stack',
  'Binary Search',
  'Linked List',
  'Trees',
  'Tries',
  'Heap / Priority Queue',
  'Backtracking',
  'Graphs',
  'Dynamic Programming',
  'Greedy',
  'Intervals',
  'Math & Geometry',
];

const buildJourney = (problemIdByDay) =>
  Array.from({ length: 100 }, (_, i) => {
    const day = i + 1;
    return {
      type: 'journey',
      slug: `day-${day}`,
      order: day,
      data: {
        day,
        title: `Day ${day}: ${focuses[i % focuses.length]}`,
        problemIds: problemIdByDay[day] ? [problemIdByDay[day]] : [],
        focus: focuses[i % focuses.length],
        isCompleted: false,
        isCurrent: day === 1,
      },
    };
  });

const seed = async () => {
  await connectDB();

  await Promise.all([Problem.deleteMany({}), Content.deleteMany({})]);

  const createdProblems = await Problem.insertMany(
    PROBLEMS.map(({ id: _legacyId, ...rest }) => rest),
  );

  const problemIdByDay = {};
  for (const problem of createdProblems) {
    if (problem.day) problemIdByDay[problem.day] = String(problem._id);
  }

  const contentDocs = [
    ...TOPICS.map((item, index) => ({ type: 'topic', slug: item.slug, order: index + 1, data: item })),
    ...COMPANIES.map((item, index) => ({
      type: 'company',
      slug: item.name.toLowerCase(),
      order: index + 1,
      data: item,
    })),
    ...ROADMAP.map((item) => ({ type: 'roadmap', slug: item.id, order: item.order, data: item })),
    ...TESTIMONIALS.map((item, index) => ({ type: 'testimonial', slug: item.id, order: index + 1, data: item })),
    ...FAQS.map((item, index) => ({ type: 'faq', slug: item.id, order: index + 1, data: item })),
    { type: 'stats', slug: 'home', order: 0, data: HOME_STATS },
    ...buildJourney(problemIdByDay),
  ];

  await Content.insertMany(contentDocs);

  const adminEmail = env.adminEmail || 'admin@algojourney.dev';
  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    admin = await User.create({
      name: 'Admin',
      email: adminEmail,
      username: 'admin',
      password: env.adminPassword,
      role: ROLES.ADMIN,
      provider: 'local',
      onboarding: { completed: true, tourCompleted: true },
    });
    console.log(`[seed] Created admin user ${adminEmail}`);
  } else if (admin.role !== ROLES.ADMIN) {
    admin.role = ROLES.ADMIN;
    await admin.save();
    console.log(`[seed] Promoted ${adminEmail} to admin`);
  } else {
    console.log(`[seed] Admin user already exists: ${adminEmail}`);
  }

  console.log(`[seed] Inserted ${createdProblems.length} problems and ${contentDocs.length} content items`);
  process.exit(0);
};

seed().catch((error) => {
  console.error('[seed] Failed', error);
  process.exit(1);
});
