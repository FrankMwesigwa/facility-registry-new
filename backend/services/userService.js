import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import User from '../models/users.js';

class UserService {
    /**
     * Create a new user
     */
    async createUser(userData) {
        const { email, password, firstname, lastname, phoneno, username, organisation, district_id, role} = userData;
        
        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            throw new Error('Email already registered');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = await User.create({
            email,
            phoneno,
            username,
            firstname,
            lastname,
            role: 'admin',
            is_verified: 'true',
            district_id,
            organisation,
            password: hashedPassword
        });

        return user;
    }

    /**
     * Create a public user with email verification
     */
    async createPublicUser(userData) {
        const { email, password, firstname, lastname, phoneno, username, organisation, district_id } = userData;
        
        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            throw new Error('Email already registered');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Generate 6-digit verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        // Set expiration to 10 minutes from now
        const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);

        const user = await User.create({
            email,
            phoneno,
            username,
            firstname,
            lastname,
            role: 'public',
            is_verified: false,
            district_id,
            organisation,
            password: hashedPassword,
            verification_code: verificationCode,
            verification_code_expires: verificationCodeExpires
        });

        return { user, verificationCode };
    }

    /**
     * Find user by email
     */
    async findByEmail(email) {
        return await User.findOne({ where: { email } });
    }

    /**
     * Find user by username
     */
    async findByUsername(username) {
        return await User.findOne({ where: { username } });
    }

    /**
     * Find user by ID
     */
    async findById(id) {
        return await User.findByPk(id);
    }

    /**
     * Find user by verification code
     */
    async findByVerificationCode(code) {
        return await User.findOne({ 
            where: { 
                verification_code: code,
                is_verified: false 
            } 
        });
    }

    /**
     * Find user by reset token
     */
    async findByResetToken(token) {
        return await User.findOne({ where: { reset_token: token } });
    }

    /**
     * Get all users with pagination
     */
    async getAllUsers(page = 1, limit = 50, role) {
        const offset = (page - 1) * limit;
        const where = role ? { role } : undefined;
        const { rows, count } = await User.findAndCountAll({ where, limit, offset, order: [['id', 'ASC']] });
        return { users: rows, total: count };
    }

    /**
     * Update user profile
     */
    async updateProfile(userId, updateData) {
        const user = await User.findOne({ where: { id: userId } });
        if (!user) {
            throw new Error('User not found');
        }

        const { firstname, lastname, email, phone_no, district_id } = updateData;
        
        user.firstname = firstname || user.firstname;
        user.lastname = lastname || user.lastname;
        user.email = email || user.email;
        user.phone_no = phone_no || user.phone_no;
        user.district_id = district_id || user.district_id;

        await user.save();
        return user;
    }

    /**
     * Update user by ID
     */
    async updateUser(userId, updateData) {
        const { password, ...fields } = updateData;
        
        if (password) {
            fields.password = await bcrypt.hash(password, 10);
        }

        const result = await User.update(
            { ...fields, updatedAt: Date.now() },
            { where: { id: userId } }
        );

        if (result[0] === 0) {
            throw new Error('User not found');
        }

        return await User.findByPk(userId);
    }

    /**
     * Delete user by ID
     */
    async deleteUser(userId) {
        const result = await User.destroy({
            where: { id: userId },
            force: true,
        });

        if (result === 0) {
            throw new Error('User not found');
        }

        return true;
    }

    /**
     * Verify user email
     */
    async verifyEmail(code) {
        const user = await this.findByVerificationCode(code);
        
        if (!user) {
            throw new Error('Invalid verification code');
        }

        if (!user.verification_code_expires) {
            throw new Error('Verification code has expired. Please register again.');
        }

        if (new Date() > user.verification_code_expires) {
            throw new Error('Verification code has expired. Please register again.');
        }

        // Update user as verified and clear verification code
        user.is_verified = true;
        user.verification_code = null;
        user.verification_code_expires = null;
        await user.save();

        return user;
    }

    /**
     * Generate reset token for password reset
     */
    async generateResetToken(email) {
        const user = await this.findByEmail(email);
        if (!user) {
            throw new Error('Email not found');
        }

        const resetToken = uuidv4();
        user.reset_token = resetToken;
        await user.save();

        return resetToken;
    }

    /**
     * Reset password using token
     */
    async resetPassword(token, newPassword) {
        const user = await this.findByResetToken(token);
        if (!user) {
            throw new Error('Invalid token');
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.reset_token = null;
        await user.save();

        return user;
    }

    /**
     * Validate password
     */
    async validatePassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    /**
     * Generate JWT token
     */
    generateToken(user) {
        return jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
    }

    /**
     * Get user profile data (excluding sensitive information)
     */
    getUserProfile(userId) {
        return User.findOne({
            where: { id: userId },
            attributes: ['firstname', 'lastname', 'email', 'phoneno', 'district_id']
        });
    }

    /**
     * Get user data for response (excluding password)
     */
    getUserResponseData(user) {
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            role: user.role,
            is_verified: user.is_verified
        };
    }
}

export default new UserService();
