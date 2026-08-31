import User from '../models/UserSchema.js';

/**
 * Restrict a route to one or more roles (role_name values).
 * Must be used AFTER authMiddleware / VerifyJwtMiddleware so req.user exists.
 */
const requireRole = (...allowedRoles) => async (req, res, next) => {
    try {
        const userId = req.user?._id || req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const user = await User.findById(userId).populate('role');
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        const roleName = user.role?.role_name;
        if (!roleName || !allowedRoles.includes(roleName)) {
            return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
        }

        next();
    } catch (error) {
        console.error('requireRole error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export default requireRole;