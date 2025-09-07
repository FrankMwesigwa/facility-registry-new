import express from "express";
import UserService from "../services/userService.js";
import authenticate from "../middleware/auth.js";

const router = express.Router();

/**
 * @route GET /api/users
 * @desc Get all users with pagination
 * @access Public
 */
router.get('/', async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 50;
        const role = req.query.role || undefined;

        const { users, total } = await UserService.getAllUsers(page, limit, role);

        res.status(200).json({
            status: "success",
            results: users.length,
            page,
            limit,
            total,
            users,
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});

/**
 * @route GET /api/users/:id
 * @desc Get user by ID
 * @access Public
 */
router.get('/:id', async (req, res) => {
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
 * @route POST /api/users
 * @desc Create a new user (admin)
 * @access Public (adjust to authenticate if needed)
 */
router.post('/', async (req, res) => {
    try {
        const user = await UserService.createUser(req.body);
        res.status(201).json({
            status: "success",
            data: { user }
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(400).json({
            status: "error",
            message: error.message,
        });
    }
});

export default router;