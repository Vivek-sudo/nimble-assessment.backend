const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DIALECT,
});

sequelize
    .sync()
    .then(() => {
        console.log('Database tables synchronized');
    })
    .catch((err) => {
        console.error('Error synchronizing database:', err);
    });

module.exports = sequelize;