const express = require('express');
const router = express.Router();
const keywordController = require('../controllers/keywordController');
const { requireAuth } = require('../middlewares/authMiddleware');

//Multer for formdata
const multer = require('multer');
const upload = multer();

// POST (Authenticated route)
router.post('/upload-csv', requireAuth, upload.single('csvFile'), keywordController.uploadCSV);

// GET (Authenticated route)
router.get('/', requireAuth, keywordController.getAllKeywords);

// GET (Authenticated route)
router.get('/search', requireAuth, keywordController.searchKeywords);

// GET (Authenticated route)
router.get('/:keywordId', requireAuth, keywordController.getKeywordById);

module.exports = router;