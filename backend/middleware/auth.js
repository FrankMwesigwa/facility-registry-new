import jwt from "jsonwebtoken";
import User from "../models/users.js";

const authenticate = async (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'Access denied' });

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.id);
        if (!user) {
            // If token is valid but user no longer exists, deny access
            return res.status(401).json({ message: 'User not found' });
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

export default authenticate;