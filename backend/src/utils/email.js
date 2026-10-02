import dns from 'dns';
import nodemailer from 'nodemailer';
import env from '../config/env.js';

// Force IPv4 DNS resolution BEFORE creating the transporter.
// Render's network cannot reach IPv6 addresses, causing Gmail SMTP to timeout.
dns.setDefaultResultOrder('ipv4first');

let transporter;

if (env.smtp.user && env.smtp.pass) {
  transporter = nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.secure,
    auth: {
      user: env.smtp.user,
      pass: env.smtp.pass,
    },
  });
}

export const sendEmail = async ({ to, subject, text, html }) => {
  if (!transporter) {
    console.warn('Email transporter not configured. Mocking email send:');
    console.warn(`To: ${to}\nSubject: ${subject}\nText: ${text}`);
    return;
  }

  const mailOptions = {
    from: `"${env.smtp.fromName}" <${env.smtp.user}>`,
    to,
    subject,
    text,
    html,
  };

  await transporter.sendMail(mailOptions);
};
