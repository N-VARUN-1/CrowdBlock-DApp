import nodemailer from 'nodemailer';
import dotenv from 'dotenv'
dotenv.config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Use the SMTP server for Gmail
    port: 587, // Use port 587 for TLS
    secure: false,
    auth: {
        user: process.env.VITE_USER_EMAIL,
        pass: process.env.VITE_USER_PASS,
    },
    tls: {
        rejectUnauthorized: false, // Only for development, not recommended for production
    },
});

export default transporter;