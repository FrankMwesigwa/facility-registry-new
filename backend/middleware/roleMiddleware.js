/**
 * Middleware to check if user is admin
 */
export const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }
    next();
};

/**
 * Middleware to check if user has specific role
 */
export const hasRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied' });
        }
        next();
    };
};

/**
 * Middleware to check if user is verified
 */
export const isVerified = (req, res, next) => {
    if (!req.user.is_verified) {
        return res.status(403).json({ message: 'Please verify your email first' });
    }
    next();
};

/**
 * Middleware to check if user can access their own data or is admin
 */
export const canAccessUser = (req, res, next) => {
    const userId = req.params.id || req.params.userId;
    if (req.user.id !== parseInt(userId) && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }
    next();
};
