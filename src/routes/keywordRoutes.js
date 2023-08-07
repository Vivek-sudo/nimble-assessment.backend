const express = require('express');
const router = express.Router();
const keywordController = require('../controllers/keywordController');
const { requireAuth } = require('../middlewares/authMiddleware');

// POST (Authenticated route)
router.post('/upload-csv', requireAuth, keywordController.uploadCSV);

// GET (Authenticated route)
router.get('/', requireAuth, keywordController.getAllKeywords);

// GET (Authenticated route)
router.get('/:keywordId', requireAuth, keywordController.getKeywordById);

module.exports = router;