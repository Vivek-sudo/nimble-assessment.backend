const jwt = require('jsonwebtoken');

function generateToken(userId) {
    const payload = { id: userId };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
}

module.exports = { generateToken };