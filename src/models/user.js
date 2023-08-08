const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

class User extends Model { }

User.init(
    {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
    },
    {
        sequelize,
        modelName: 'user',
    }
);

module.exports = User;