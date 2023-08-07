const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const keywordRoutes = require('./keywordRoutes');

router.use('/auth', authRoutes);
router.use('/keywords', keywordRoutes);

module.exports = router;