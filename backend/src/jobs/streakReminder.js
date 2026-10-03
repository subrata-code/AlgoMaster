import User from '../models/User.js';
import { sendEmail } from '../utils/email.js';

// Helper for email template (assuming it exists or will be created)
const streakReminderTemplate = (user) => {
  return `
    <div style="font-family: sans-serif;">
      <h2>Don't break your streak, ${user.name}!</h2>
      <p>You have a <strong>${user.progress.streak}-day streak</strong> on AlgoJourney.</p>
      <p>Solve at least one problem today to keep it alive!</p>
      <a href="${process.env.CLIENT_URL}/problems">Go to Practice</a>
    </div>
  `;
};

// Runs every day at 8 PM IST (2:30 PM UTC)
// Finds users with active streaks (streak >= 1) who haven't solved today
// Sends email: "Don't break your 5-day streak! Solve one problem today."
export const sendStreakReminders = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const users = await User.find({
    'progress.streak': { $gte: 1 },
    'progress.lastSolvedAt': { $lt: today }
  }).select('email name progress');

  for (const user of users) {
    if (user.email) {
      await sendEmail({
        to: user.email,
        subject: `⚡ Don't break your ${user.progress.streak}-day streak!`,
        html: streakReminderTemplate(user)
      }).catch((err) => console.error(`Failed to send streak reminder to ${user.email}:`, err));
    }
  }
};
