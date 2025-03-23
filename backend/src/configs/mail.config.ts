import nodemailer from 'nodemailer'
import { env } from './env.config'
import dotenv from 'dotenv'
dotenv.config();

export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.PASSKEY
    },
    logger: true,   // Debugging logs
    debug: true     // Show detailed logs
});


