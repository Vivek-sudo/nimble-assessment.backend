require('dotenv').config();
const express = require('express');
const db = require('./config/dbConfig');
const cors = require('cors');

// Import routes
const routes = require('./routes');

// Import error handler
const { errorHandler } = require('./utils/errorHandler');

const app = express();

app.use(cors())

// Database connection
db.authenticate()
    .then(() => {
        console.log('Database connection has been established successfully.');
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });

app.use(express.json());

// Routes
app.use('/api', routes);

app.use(errorHandler);

module.exports = app;