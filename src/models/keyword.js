const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const User = require('./user');

class Keyword extends Model { }

Keyword.init(
    {
        keyword: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        totalAdWordsAdvertisers: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        totalLinks: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        totalSearchResults: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        htmlCode: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'keyword',
    }
);

// Set up the association between User and Keyword
User.hasMany(Keyword, { onDelete: 'CASCADE' });
Keyword.belongsTo(User);

module.exports = Keyword;