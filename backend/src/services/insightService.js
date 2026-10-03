import User from '../models/User.js';
import Problem from '../models/Problem.js';

export const computeWeaknesses = async (userId) => {
  const user = await User.findById(userId);
  if (!user) return [];

  // Count solved by topic
  const solvedByTopic = {};
  for (const item of user.solvedProblems) {
    for (const topic of item.topics || []) {
      if (!solvedByTopic[topic]) solvedByTopic[topic] = { easy: 0, medium: 0, hard: 0 };
      const diffKey = item.difficulty?.toLowerCase() || 'easy';
      if (solvedByTopic[topic][diffKey] !== undefined) {
        solvedByTopic[topic][diffKey] += 1;
      }
    }
  }

  // Get totals from DB
  const topicTotals = await Problem.aggregate([
    { $match: { status: 'published' } },
    { $unwind: '$topics' },
    {
      $group: {
        _id: '$topics',
        easy: { $sum: { $cond: [{ $eq: ['$difficulty', 'Easy'] }, 1, 0] } },
        medium: { $sum: { $cond: [{ $eq: ['$difficulty', 'Medium'] }, 1, 0] } },
        hard: { $sum: { $cond: [{ $eq: ['$difficulty', 'Hard'] }, 1, 0] } },
      },
    },
  ]);

  const weaknesses = [];
  for (const row of topicTotals) {
    const topic = row._id;
    const solved = solvedByTopic[topic] || { easy: 0, medium: 0, hard: 0 };
    
    // Weights: easy=1, medium=2, hard=3
    const totalWeight = row.easy * 1 + row.medium * 2 + row.hard * 3;
    const solvedWeight = solved.easy * 1 + solved.medium * 2 + solved.hard * 3;
    
    // If there are no published problems for this topic, ignore it.
    if (totalWeight === 0) continue;

    // A higher score means it's a bigger weakness (closer to 1.0 means almost 0% solved)
    const score = 1 - (solvedWeight / totalWeight);
    
    // Only flag it as a weakness if they have solved less than 50% of the weighted score
    if (score > 0.5) {
      weaknesses.push({
        topic,
        score,
        solvedCount: solved.easy + solved.medium + solved.hard,
        totalCount: row.easy + row.medium + row.hard,
      });
    }
  }

  // Sort descending by score (highest weakness first)
  weaknesses.sort((a, b) => b.score - a.score);

  // Return top 5
  return weaknesses.slice(0, 5);
};
