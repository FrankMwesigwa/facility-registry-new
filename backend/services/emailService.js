import transporter from '../utils/mail.js';

class EmailService {
    /**
     * Send email verification code
     */
    async sendVerificationEmail(email, firstname, lastname, verificationCode) {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            sender: process.env.EMAIL_USER,
            replyTo: process.env.EMAIL_USER,
            to: email,
            subject: 'National Health Facility Registry - Verify Your Email',
            envelope: { from: process.env.EMAIL_USER, to: email },
            html: `
                <h3>Hello ${firstname} ${lastname},</h3>
                <p>Thank you for registering with the National Health Facility Registry. To verify your email address, please use the following verification code:</p>
                <h2 style="font-size: 24px; padding: 10px; background-color: #f5f5f5; text-align: center; letter-spacing: 5px;">${verificationCode}</h2>
                <p>This code will expire in 10 minutes.</p>
                <p>If you did not request this verification code, please ignore this email.</p>
            `
        };

        await transporter.sendMail(mailOptions);
    }

    /**
     * Send password reset email
     */
    async sendPasswordResetEmail(email, resetToken) {
        const serverUrl = process.env.SERVER_URL;
        const resetLink = `${serverUrl}/reset-password/${resetToken}`;
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            sender: process.env.EMAIL_USER,
            replyTo: process.env.EMAIL_USER,
            to: email,
            subject: 'National Health Facility Registry - Reset Password',
            envelope: { from: process.env.EMAIL_USER, to: email },
            html: `
                <h3>Hello ${email}</h3>
                <p><strong>${email}</strong>. Click 'Reset Password' To reset your password</p>
                <p>
                    <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px;">
                        Reset Password
                    </a>
                </p>
            `
        };

        await transporter.sendMail(mailOptions);
    }

    /**
     * Send welcome email
     */
    async sendWelcomeEmail(email, firstname, lastname) {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            sender: process.env.EMAIL_USER,
            replyTo: process.env.EMAIL_USER,
            to: email,
            subject: 'Welcome to National Health Facility Registry',
            envelope: { from: process.env.EMAIL_USER, to: email },
            html: `
                <h3>Welcome ${firstname} ${lastname}!</h3>
                <p>Your account has been successfully created and verified.</p>
                <p>You can now access all features of the National Health Facility Registry.</p>
                <p>Thank you for joining us!</p>
            `
        };

        await transporter.sendMail(mailOptions);
    }

    /**
     * Send account update notification
     */
    async sendAccountUpdateEmail(email, firstname, lastname) {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            sender: process.env.EMAIL_USER,
            replyTo: process.env.EMAIL_USER,
            to: email,
            subject: 'Account Updated - National Health Facility Registry',
            envelope: { from: process.env.EMAIL_USER, to: email },
            html: `
                <h3>Hello ${firstname} ${lastname},</h3>
                <p>Your account information has been successfully updated.</p>
                <p>If you did not make these changes, please contact our support team immediately.</p>
            `
        };

        await transporter.sendMail(mailOptions);
    }
}

export default new EmailService();
