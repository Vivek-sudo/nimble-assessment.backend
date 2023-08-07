const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeGoogle(keyword) {
    try {
        const response = await axios.get(`https://www.google.com/search?q=${encodeURIComponent(keyword)}`);
        const html = response.data;
        const $ = cheerio.load(html);

        // Extract the desired data from the search results page
        const adWordsAdvertisers = $('.ads-ad').length;
        const totalLinks = $('a').length;
        const totalSearchResults = $('#result-stats').text();

        // Return the extracted data as an object
        return {
            adWordsAdvertisers,
            totalLinks,
            totalSearchResults,
            htmlCode: html,
        };
    } catch (error) {
        console.error('Error while scraping Google:', error);
        throw error;
    }
}

module.exports = { scrapeGoogle };