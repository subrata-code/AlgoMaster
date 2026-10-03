import { ACHIEVEMENTS } from '../constants/index.js';
import * as notificationService from './notificationService.js';

export const evaluateAchievements = async (user) => {
  const solvedCount = user.solvedProblems.length;
  const streak = user.progress?.streak || 0;
  let updated = false;

  const checkAndAward = async (id, condition) => {
    if (condition && !user.unlockedAchievements.includes(id)) {
      user.unlockedAchievements.push(id);
      user.pushActivity({
        type: 'achievement',
        title: 'Achievement Unlocked!',
        description: ACHIEVEMENTS.find(a => a.id === id)?.title || id,
      });
      await notificationService.create(user._id, {
        type: 'achievement',
        title: '🏆 Achievement Unlocked!',
        message: ACHIEVEMENTS.find(a => a.id === id)?.title || id,
        link: '/profile',
      });
      updated = true;
    }
  };

  await checkAndAward('first_solve', solvedCount >= 1);
  await checkAndAward('streak_3', streak >= 3);
  await checkAndAward('streak_10', streak >= 10);
  await checkAndAward('solve_50', solvedCount >= 50);
  await checkAndAward('solve_100', solvedCount >= 100);

  return updated;
};

export const getAchievementsWithProgress = (user) => {
  const solvedCount = user.solvedProblems.length;
  const streak = user.progress?.streak || 0;

  return ACHIEVEMENTS.map(ach => {
    let progress = 0;
    if (ach.id.startsWith('solve') || ach.id === 'first_solve') progress = solvedCount;
    if (ach.id.startsWith('streak')) progress = streak;
    
    if (progress > ach.total) progress = ach.total;
    
    return {
      ...ach,
      progress,
      unlockedAt: user.unlockedAchievements.includes(ach.id) ? new Date().toISOString() : undefined // we don't store exact date right now for simplicity
    };
  });
};
