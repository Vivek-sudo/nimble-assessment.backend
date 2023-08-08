const { CustomError } = require('../utils/errorHandler');
const User = require('../models/user');
const userService = require('../services/userService');

const register = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        // Check if user with the same email already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            throw new CustomError('User with this email already exists', 400);
        }

        // Create the new user
        const newUserToken = await userService.registerUser({ email, password });

        res.status(201).json({ token: newUserToken });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        // Use userService.loginUser function to handle login process
        const userToken = await userService.loginUser(email, password);

        res.status(200).json({ token: userToken });
    } catch (error) {
        next(error);
    }
};

module.exports = { register, login };