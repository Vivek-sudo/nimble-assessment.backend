const jwt = require('jsonwebtoken');
const User = require('../models/user');

const requireAuth = (req, res, next) => {
    const auth = req.headers.authorization;
    let token;

    //Splitting Bearer from it
    if (auth) {
        token = auth.split('Bearer ')[1];
    }
    // Check if JWT token exists
    if (token) {
        // Verify the token
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if (err) {
                console.error('Error verifying JWT token:', err);
                res.status(401).json({ message: 'Unauthorized' });
            } else {
                // Token is valid, fetch the user from the database and attach it to the request
                try {
                    const user = await User.findByPk(decodedToken.id);
                    if (!user) {
                        return res.status(401).json({ message: 'Unauthorized' });
                    }
                    req.user = user;
                    next();
                } catch (error) {
                    console.error('Error fetching user from the database:', error);
                    res.status(500).json({ message: 'Server error' });
                }
            }
        });
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
};

module.exports = { requireAuth };