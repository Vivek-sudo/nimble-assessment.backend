const { CustomError } = require('../utils/errorHandler');
const keywordService = require('../services/keywordService');
const { scrapeGoogle } = require('../utils/scraper');
const csvParser = require('csv-parser');

const uploadCSV = async (req, res, next) => {
    // Ensure that the CSV file is provided in the request
    if (!req.files || !req.files.csvFile) {
        return res.status(400).json({ message: 'CSV file is missing in the request.' });
    }

    // Read the CSV file from the request
    const csvFile = req.files.csvFile;

    // Process the CSV file
    try {
        const keywords = [];
        fs.createReadStream(csvFile.tempFilePath)
            .pipe(csvParser())
            .on('data', (row) => {
                // Assuming that the keyword column in the CSV is named 'keyword'
                if (row.keyword) {
                    keywords.push(row.keyword.trim());
                }
            })
            .on('end', async () => {
                // Scrape data for each keyword and store it in the database
                for (const keyword of keywords) {
                    // Scrape data using the scraper function
                    const scrapedData = await scrapeGoogle(keyword);

                    // Create the keyword and its associated search result in the database
                    await keywordService.createKeyword(scrapedData, req.user.id);
                }

                res.status(200).json({ message: 'CSV file uploaded and data scraped successfully.' });
            });
    } catch (error) {
        next(error);
    }
};

const getAllKeywords = async (req, res, next) => {
    const userId = req.user.id;

    try {
        const keywords = await keywordService.getKeywordsByUser(userId);
        res.status(200).json(keywords);
    } catch (error) {
        next(error);
    }
};

const getKeywordById = async (req, res, next) => {
    const { keywordId } = req.params;
    const userId = req.user.id;

    try {
        const keyword = await keywordService.getKeywordById(keywordId, userId);
        res.status(200).json(keyword);
    } catch (error) {
        next(error);
    }
};

module.exports = { uploadCSV, getAllKeywords, getKeywordById };