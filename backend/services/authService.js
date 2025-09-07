import UserService from './userService.js';

class AuthService {
    /**
     * Authenticate user login
     */
    async login(username, password) {
        if (!username || !password) {
            throw new Error('All fields are required');
        }

        const user = await UserService.findByUsername(username);
        if (!user || !(await UserService.validatePassword(password, user.password))) {
            throw new Error('Invalid credentials');
        }

        if (!user.is_verified) {
            throw new Error('Please verify your email first');
        }

        const token = UserService.generateToken(user);
        const userData = UserService.getUserResponseData(user);

        return { token, user: userData };
    }

    /**
     * Register a new public user
     */
    async registerPublicUser(userData) {
        const { user, verificationCode } = await UserService.createPublicUser(userData);
        return { user, verificationCode };
    }

    /**
     * Register a new user (admin endpoint)
     */
    async registerUser(userData) {
        const user = await UserService.createUser(userData);
        return user;
    }

    /**
     * Verify email with code
     */
    async verifyEmail(code) {
        if (!code) {
            throw new Error('Verification code is required');
        }

        const user = await UserService.verifyEmail(code);
        const token = UserService.generateToken(user);
        const userData = UserService.getUserResponseData(user);

        return { token, user: userData };
    }

    /**
     * Initiate password reset
     */
    async initiatePasswordReset(email) {
        if (!email) {
            throw new Error('Email is required');
        }

        const resetToken = await UserService.generateResetToken(email);
        return { resetToken, email };
    }

    /**
     * Reset password with token
     */
    async resetPassword(token, password) {
        if (!password) {
            throw new Error('Password is required');
        }

        const user = await UserService.resetPassword(token, password);
        return user;
    }

    /**
     * Get current user profile
     */
    async getCurrentUser(userId) {
        const user = await UserService.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    /**
     * Update user profile
     */
    async updateProfile(userId, updateData) {
        const user = await UserService.updateProfile(userId, updateData);
        return user;
    }
}

export default new AuthService();
