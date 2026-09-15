import nodemailer from 'nodemailer'

const smtpConfigured = Boolean(
  process.env.SMTP_HOST &&
  process.env.SMTP_PORT &&
  process.env.SMTP_USER &&
  process.env.SMTP_PASSWORD &&
  process.env.MAIL_FROM
)

const transporter = smtpConfigured
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    })
  : null

export const isEmailConfigured = () => smtpConfigured

export async function sendPasswordResetEmail({ to, name, resetUrl }) {
  if (!transporter) {
    throw new Error('SMTP email delivery is not configured.')
  }

  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject: 'Reset your Construction Management System password',
    text: `Hello ${name || 'there'},\n\nUse this link to reset your password. It expires in one hour:\n${resetUrl}\n\nIf you did not request this, you can ignore this email.`,
    html: `<p>Hello ${name || 'there'},</p><p>Use the link below to reset your password. It expires in one hour.</p><p><a href="${resetUrl}">Reset password</a></p><p>If you did not request this, you can ignore this email.</p>`,
  })
}