import express from "express";
import UserService from "../services/userService.js";
import { validateUserRegistration } from "../helpers/validation.js";
import authenticate from "../middleware/auth.js";
import { isAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

/**
 * @route GET /api/admin/users
 * @desc Get all users (admin only)
 * @access Private (Admin)
 */
router.get('/users', authenticate, isAdmin, async (req, res) => {
    try {
        const users = await UserService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users' });
    }
});

/**
 * @route POST /api/admin/register
 * @desc Register a new user (admin only)
 * @access Private (Admin)
 */
router.post('/register', authenticate, async (req, res) => {
    try {
        const validatedData = validateUserRegistration(req.body);
        const user = await UserService.createUser(validatedData);
        
        res.status(200).json({ 
            message: 'User Created Successfully.',
            user: UserService.getUserResponseData(user)
        });
    } catch (error) {
        console.error('User creation error:', error);
        res.status(400).json({ message: error.message });
    }
});

/**
 * @route GET /api/admin/users/:id
 * @desc Get user by ID (admin only)
 * @access Private (Admin)
 */
router.get('/users/:id', authenticate, isAdmin, async (req, res) => {
    try {
        const user = await UserService.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({
                status: "fail",
                message: "User with that ID not found",
            });
        }

        res.status(200).json({
            status: "success",
            data: { user },
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});

/**
 * @route PATCH /api/admin/users/:id
 * @desc Update user by ID (admin only)
 * @access Private (Admin)
 */
router.patch('/users/:id', authenticate, isAdmin, async (req, res) => {
    try {
        const user = await UserService.updateUser(req.params.id, req.body);
        
        res.status(200).json({
            status: "success",
            data: { user },
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(400).json({
            status: "error",
            message: error.message,
        });
    }
});

/**
 * @route DELETE /api/admin/users/:id
 * @desc Delete user by ID (admin only)
 * @access Private (Admin)
 */
router.delete('/users/:id', authenticate, isAdmin, async (req, res) => {
    try {
        await UserService.deleteUser(req.params.id);
        res.status(204).json();
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(400).json({
            status: "error",
            message: error.message,
        });
    }
});

export default router;
