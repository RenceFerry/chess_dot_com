import 'server-only';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.BREVO_SMTP_SERVER!,
  port: parseInt(process.env.BREVO_PORT!),
  secure: false,
  auth: {
    user: process.env.BREVO_EMAIL_ACCOUNT,
    pass: process.env.BREVO_SMTP_KEY,
  }
})

export default transporter;