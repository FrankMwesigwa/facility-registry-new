import nodemailer from 'nodemailer';
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP,
    port: Number(process.env.EMAILPORT),
    secure: Number(process.env.EMAILPORT) === 465,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    },
    dkim: process.env.DKIM_DOMAIN && process.env.DKIM_PRIVATE_KEY && process.env.DKIM_SELECTOR ? {
        domainName: process.env.DKIM_DOMAIN,
        keySelector: process.env.DKIM_SELECTOR,
        privateKey: process.env.DKIM_PRIVATE_KEY
    } : undefined
});

export default transporter;