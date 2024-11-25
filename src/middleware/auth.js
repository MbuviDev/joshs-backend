const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect middleware: Verifies token and attaches user to `req`
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract token
            token = req.headers.authorization.split(' ')[1];

            // Decode token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find user from token and exclude password from selection
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(404).json({ message: 'User not found' });
            }

            next(); // Proceed to the next middleware or route handler
        } catch (error) {
            console.error('Token verification error:', error.message);
            res.status(401).json({ message: 'Not authorized, invalid token' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token provided' });
    }
};

// Admin middleware: Checks if the user is an admin
const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next(); // User is an admin; proceed
    } else {
        res.status(403).json({ message: 'Access denied, admin only' }); // Forbidden
    }
};

module.exports = { protect, admin };
