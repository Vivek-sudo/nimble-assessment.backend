require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const db = require('./config/dbConfig');

// Import routes
const routes = require('./routes');

// Import error handler
const { errorHandler } = require('./utils/errorHandler');

const app = express();

// Database connection
db.authenticate()
    .then(() => {
        console.log('Database connection has been established successfully.');
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });

app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api', routes);

app.use(errorHandler);

module.exports = app;