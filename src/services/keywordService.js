const { CustomError } = require('../utils/errorHandler');
const Keyword = require('../models/keyword');

async function createKeyword(keywordData, userId) {
    try {
        const keyword = await Keyword.create({ ...keywordData, userId });
        return keyword;
    } catch (error) {
        console.error('Error creating keyword:', error);
        throw new CustomError('Failed to create keyword', 500);
    }
}

async function getKeywordsByUser(userId) {
    try {
        const keywords = await Keyword.findAll({ where: { userId } });
        return keywords;
    } catch (error) {
        console.error('Error fetching keywords:', error);
        throw new CustomError('Failed to fetch keywords', 500);
    }
}

async function getKeywordById(keywordId, userId) {
    try {
        const keyword = await Keyword.findOne({ where: { id: keywordId, userId } });
        if (!keyword) {
            throw new CustomError('Keyword not found', 404);
        }
        return keyword;
    } catch (error) {
        console.error('Error fetching keyword by ID:', error);
        throw new CustomError('Failed to fetch keyword', 500);
    }
}

module.exports = { createKeyword, getKeywordsByUser, getKeywordById };
