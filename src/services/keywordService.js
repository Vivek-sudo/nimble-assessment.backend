const { CustomError } = require('../utils/errorHandler');
const Keyword = require('../models/keyword');
const zlib = require('zlib');
const { Op } = require('sequelize');

async function createKeyword(keywordData, userId) {
    try {
        const keyword = await Keyword.create({ ...keywordData, userId });
        return keyword;
    } catch (error) {
        console.error('Error creating keyword:', error);
        throw new CustomError('Failed to create keyword', 500);
    }
}

async function createKeywords(keywordDataArray, userId) {
    try {
        if (!keywordDataArray || !keywordDataArray.length) {
            throw new CustomError('Empty keywords array', 400);
        }

        // Add the userId to each keywordData object in the array
        const keywordDataWithUserId = keywordDataArray.map(keywordData => ({
            ...keywordData,
            userId
        }));

        // Perform bulk insertion of keywordData
        const keywords = await Keyword.bulkCreate(keywordDataWithUserId);

        return keywords;
    } catch (error) {
        console.error('Error creating keywords:', error);
        throw new CustomError(error.message || 'Failed to create keywords', error.statusCode || 500);
    }
}

async function getKeywordsByUser(userId, page = 1, pageSize = 10) {
    try {
        //Setting offset
        const offset = (page - 1) * pageSize;

        const keywords = await Keyword.findAll({
            where: { userId },
            order: [['createdAt', 'DESC']],
            offset,
            limit: pageSize
        });

        return keywords;
    } catch (error) {
        console.error('Error fetching keywords:', error);
        throw new CustomError('Failed to fetch keywords', 500);
    }
}

async function getKeywordById(keywordId, userId) {
    try {
        const keyword = await Keyword.findOne({ where: { id: keywordId, userId } });

        // If keyword not found
        if (!keyword) {
            throw new CustomError('Keyword not found', 404);
        }

        // Decode the base64 encoded htmlCode
        const decodedHtmlCode = Buffer.from(keyword.htmlCode, 'base64');

        // Decompress the decoded htmlCode using zlib
        const decompressedHtmlCode = zlib.gunzipSync(decodedHtmlCode).toString();

        // Create a new object with the decrypted htmlCode
        const decryptedKeyword = {
            ...keyword.toJSON(),
            htmlCode: decompressedHtmlCode
        };

        return decryptedKeyword;
    } catch (error) {
        console.error('Error fetching keyword by ID:', error);
        throw new CustomError('Failed to fetch keyword', 500);
    }
}

async function searchKeywordByUser(userId, keyword, page = 1, pageSize = 10) {
    if (!keyword) {
        throw new CustomError('Keyword not provided', 400);
    }

    try {
        const offset = (page - 1) * pageSize;
        const keywords = await Keyword.findAndCountAll({
            where: {
                userId,
                keyword: {
                    [Op.iLike]: `%${keyword}%`
                }
            },
            order: [['createdAt', 'DESC']],
            offset,
            limit: pageSize
        });

        return keywords;
    } catch (error) {
        console.error('Error searching keywords:', error);
        throw new CustomError('Failed to search keywords', 500);
    }
}

module.exports = {
    createKeyword,
    createKeywords, getKeywordsByUser,
    getKeywordById, searchKeywordByUser
};
