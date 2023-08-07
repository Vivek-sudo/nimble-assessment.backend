const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/dbConfig');

class User extends Model {
    async comparePassword(password) {
        return bcrypt.compare(password, this.password);
    }
}

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
            allowNull: false,
            set(value) {
                const hashedPassword = bcrypt.hashSync(value, 10);
                this.setDataValue('password', hashedPassword);
            },
        },
    },
    {
        sequelize,
        modelName: 'user',
    }
);

module.exports = User;