import express from "express";
import authRoutes from "./auth.js";
import adminRoutes from "./admin.js";
import userRoutes from "./users.js";
import mflRoutes from "./mfl.js";

const router = express.Router();

// Mount route modules
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/users', userRoutes);
router.use('/mfl', mflRoutes);

export default router;
