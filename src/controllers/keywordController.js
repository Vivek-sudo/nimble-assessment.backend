const keywordService = require('../services/keywordService');
const { scrapeMultipleKeywords } = require('../utils/scraper');
const csvParser = require('csv-parser');
const { Readable } = require('stream');

const uploadCSV = async (req, res, next) => {
    // Ensure that the CSV file is provided in the request
    if (!req.file) {
        return res.status(400).json({ message: 'CSV file is missing in the request.' });
    }

    // Read the CSV file from the request
    const csvFile = req.file;

    // Process the CSV file
    try {
        const keywords = [];

        // Convert the Buffer to a string
        const csvData = csvFile.buffer.toString();

        // Use a Readable stream from the csvData
        const readableStream = new Readable();
        readableStream.push(csvData);
        readableStream.push(null);

        readableStream
            .pipe(csvParser())
            .on('data', (row) => {
                if (row.keyword) {
                    keywords.push(row.keyword.trim());
                }
            })
            .on('end', async () => {
                //Scrape Keywords on Google
                const scrapedData = await scrapeMultipleKeywords(keywords);

                //Create keywords
                await keywordService.createKeywords(scrapedData, req.user.id);

                res.status(200).json({ message: 'CSV file uploaded and data scraped successfully.' });
            });
    } catch (error) {
        next(error);
    }
};

const getAllKeywords = async (req, res, next) => {
    const userId = req.user.id;
    const { page, pageSize } = req.query;

    try {
        const keywords = await
            keywordService.getKeywordsByUser(userId, page, pageSize);
        res.status(200).json(keywords);
    } catch (error) {
        next(error);
    }
};

const searchKeywords = async (req, res, next) => {
    const userId = req.user.id;
    const { keyword } = req.query;

    try {
        const keywords = await
            keywordService.searchKeywordByUser(userId, keyword);
        res.status(200).json(keywords);
    } catch (error) {
        next(error);
    }
};

const getKeywordById = async (req, res, next) => {
    const { keywordId } = req.params;
    const userId = req.user.id;

    try {
        const keyword = await
            keywordService.getKeywordById(keywordId, userId);
        res.status(200).json(keyword);
    } catch (error) {
        next(error);
    }
};

module.exports = { uploadCSV, getAllKeywords, getKeywordById, searchKeywords };