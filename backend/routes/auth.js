import express from "express";
import AuthService from "../services/authService.js";
import EmailService from "../services/emailService.js";
import { validateUserRegistration, validateLogin } from "../helpers/validation.js";
import authenticate from "../middleware/auth.js";

const router = express.Router();

/**
 * @route POST /api/auth/register/public
 * @desc Register a new public user
 * @access Public
 */
router.post('/register/public', async (req, res) => {
    try {
        const { token, user } = await AuthService.registerPublicUser(req.body);

        res.status(200).json({ 
            message: 'Registration successful',
            token,
            user
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(400).json({ 
            message: error.message || 'Registration failed',
            error: error.message 
        });
    }
});

/**
 * @route POST /api/auth/verifycode
 * @desc Verify email with verification code
 * @access Public
 */
router.post('/verifycode', async (req, res) => {
    try {
        const { token, user } = await AuthService.verifyEmail(req.body.code);
        
        res.status(200).json({ 
            message: 'Email verified successfully',
            token,
            user
        });
    } catch (error) {
        console.error('Verification error:', error);
        res.status(400).json({ message: error.message });
    }
});

/**
 * @route POST /api/auth/login
 * @desc Login user
 * @access Public
 */
router.post('/login', async (req, res) => {
    try {
        const validatedData = validateLogin(req.body);
        const { token, user } = await AuthService.login(validatedData.username, validatedData.password);
        
        res.status(200).json({ 
            message: 'Login successful', 
            token, 
            user 
        });
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(400).json({ message: error.message });
    }
});

/**
 * @route POST /api/auth/forgotpassword
 * @desc Initiate password reset
 * @access Public
 */
router.post('/forgotpassword', async (req, res) => {
    try {
        const { resetToken, email } = await AuthService.initiatePasswordReset(req.body.email);
        
        await EmailService.sendPasswordResetEmail(email, resetToken);
        
        res.status(200).json({ message: 'Password reset link sent to email' });
    } catch (error) {
        console.error('Password reset error:', error);
        res.status(400).json({ message: error.message });
    }
});

/**
 * @route POST /api/auth/resetpassword/:token
 * @desc Reset password with token
 * @access Public
 */
router.post('/resetpassword/:token', async (req, res) => {
    try {
        await AuthService.resetPassword(req.params.token, req.body.password);
        
        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.error('Password reset error:', error);
        res.status(400).json({ message: error.message });
    }
});

/**
 * @route GET /api/auth/me
 * @desc Get current user profile
 * @access Private
 */
router.get('/me', authenticate, async (req, res) => {
    try {
        const user = await AuthService.getCurrentUser(req.user.id);
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

/**
 * @route GET /api/auth/profile
 * @desc Get current user profile (limited fields)
 * @access Private
 */
router.get('/profile', authenticate, async (req, res) => {
    try {
        const user = await AuthService.getCurrentUser(req.user.id);
        const profile = {
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            phone_no: user.phone_no,
            district_id: user.district_id
        };
        res.status(200).json(profile);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

/**
 * @route PUT /api/auth/updateprofile
 * @desc Update user profile
 * @access Private
 */
router.put('/updateprofile', authenticate, async (req, res) => {
    try {
        await AuthService.updateProfile(req.user.id, req.body);
        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(400).json({ message: error.message });
    }
});

export default router;
