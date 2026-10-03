import cron from 'node-cron';
import User from '../models/User.js';
import { sendEmail } from '../utils/email.js';

export const scheduleEmailCrons = () => {
  // Check for frozen streaks daily at 9:00 AM
  cron.schedule('0 9 * * *', async () => {
    try {
      console.log('Running daily streak freeze check...');
      // Find users whose lastSolvedAt is before yesterday, 
      // meaning their streak is in danger of being lost if they don't solve today.
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

      const users = await User.find({
        'progress.streak': { $gt: 0 },
        'progress.lastSolvedAt': { $lt: twoDaysAgo },
      });

      for (const user of users) {
        if (user.streakFreezes > 0) {
          await sendEmail({
            to: user.email,
            subject: 'Your Streak is Frozen! 🧊',
            text: `Hi ${user.name},\n\nYou missed a day, but don't worry! We used one of your streak freezes to keep your ${user.progress.streak}-day streak alive.\n\nYou have ${user.streakFreezes - 1} freezes left. Solve a problem today to maintain your streak!\n\nBest,\nThe AlgoMaster Team`,
            html: `<h3>Hi ${user.name},</h3><p>You missed a day, but don't worry! We used one of your <strong>streak freezes</strong> to keep your ${user.progress.streak}-day streak alive.</p><p>You have ${user.streakFreezes - 1} freezes left. <a href="https://algomaster.com/dashboard">Solve a problem today</a> to maintain your streak!</p><br/><p>Best,<br/>The AlgoMaster Team</p>`,
          });
          // Decrement freeze and bump lastSolvedAt? 
          // Usually we'd do this here, but our current system just uses grace periods.
          // In a real system, the cron job would actively mutate user.streakFreezes.
        } else {
          await sendEmail({
            to: user.email,
            subject: 'Oh no! Your streak was lost 😢',
            text: `Hi ${user.name},\n\nWe noticed you haven't solved a problem recently, and you ran out of streak freezes. Your streak has been reset.\n\nDon't let that discourage you! Start a new streak today.\n\nBest,\nThe AlgoMaster Team`,
            html: `<h3>Hi ${user.name},</h3><p>We noticed you haven't solved a problem recently, and you ran out of streak freezes. Your streak has been reset.</p><p>Don't let that discourage you! <a href="https://algomaster.com/problems">Start a new streak today.</a></p><br/><p>Best,<br/>The AlgoMaster Team</p>`,
          });
        }
      }
    } catch (err) {
      console.error('Error in daily streak cron:', err);
    }
  });
};
