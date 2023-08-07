const { CustomError } = require('../utils/errorHandler');
const keywordService = require('../services/keywordService');

const uploadCSV = async (req, res) => {
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
                    const scrapedData = await scrapeGoogleData(keyword);

                    // Create the keyword and its associated search result in the database
                    await keywordService.createKeywordAndSearchResult(keyword, scrapedData, req.user.id);
                }

                res.status(200).json({ message: 'CSV file uploaded and data scraped successfully.' });
            });
    } catch (error) {
        console.error('Error processing CSV file:', error);
        throw new CustomError(error.message || 'Something went wrong', error.statusCode || 500);
    }
};

const getAllKeywords = async (req, res) => {
    const userId = req.user.id;

    try {
        const keywords = await keywordService.getKeywordsByUser(userId);
        res.status(200).json(keywords);
    } catch (error) {
        console.error('Error fetching keywords:', error);
        throw new CustomError(error.message || 'Something went wrong', error.statusCode || 500);
    }
};

const getKeywordById = async (req, res) => {
    const { keywordId } = req.params;
    const userId = req.user.id;

    try {
        const keyword = await keywordService.getKeywordById(keywordId, userId);
        res.status(200).json(keyword);
    } catch (error) {
        console.error('Error fetching keyword by ID:', error);
        throw new CustomError(error.message || 'Something went wrong', error.statusCode || 500);
    }
};

module.exports = { uploadCSV, getAllKeywords, getKeywordById };