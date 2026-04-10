import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: parseInt(process.env.MAIL_PORT || '587'),
  secure: process.env.MAIL_SECURE === 'true',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

/**
 * Send an email.
 * @param {{ to: string, subject: string, html: string, text?: string }} options
 */
export async function sendEmail({ to, subject, html, text }) {
  await transporter.sendMail({
    from: `"${process.env.MAIL_FROM_NAME || 'Project Management'}" <${process.env.MAIL_FROM_ADDRESS || process.env.MAIL_USER}>`,
    to,
    subject,
    html,
    ...(text && { text }),
  });
}
