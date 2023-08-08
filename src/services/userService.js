const User = require('../models/user');
const { generateToken } = require('../utils/tokenUtils');
const bcrypt = require('bcrypt');
const { CustomError } = require('../utils/errorHandler');

async function registerUser(userData) {
    try {
        const { email, password } = userData;
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create the new user with hashed password
        const newUser = await User.create({ email, password: hashedPassword });

        // Generate JWT token
        const token = generateToken(newUser.id);

        return token;
    } catch (error) {
        console.error('Error registering user:', error);
        throw new CustomError(error.message || 'Something went wrong', error.statusCode || 500);
    }
}

async function loginUser(email, password) {
    try {
        // Find the user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new CustomError('User not found', 400);
        }

        // Check if the password matches
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new CustomError('Invalid password', 401);
        }

        // Generate JWT token
        const token = generateToken(user.id);

        return token;
    } catch (error) {
        console.error('Error logging in user:', error);
        throw new CustomError(error.message || 'Something went wrong', error.statusCode || 500);
    }
}

module.exports = { registerUser, loginUser };