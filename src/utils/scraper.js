const puppeteer = require('puppeteer');
const zlib = require('zlib');

async function scrapeGoogle(keyword) {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(`https://www.google.com/search?q=${encodeURIComponent(keyword)}`);

        // Wait for the required elements to be rendered on the page
        await page.waitForSelector('#tads > div');
        await page.waitForSelector('#rso');
        await page.waitForSelector('#result-stats');

        // Extract the number of AdWords advertisers
        const adWordsAdvertisers = await page.evaluate(() => {
            return document.querySelectorAll('#tads > div').length;
        });

        // Extract the total number of links (all of them) on the page
        const linksArray = await page.evaluate(() => {
            const rsoDiv = document.querySelector('#rso');
            const links = rsoDiv.querySelectorAll('div > div > div > div > div > div > div > a');
            return Array.from(links).map(link => link.href);
        });

        // Filter out links with the host "google.com"
        const filteredLinks = linksArray.filter(link => !link.includes('google.com'));

        // Remove duplicates from the filteredLinks array
        const uniqueLinks = Array.from(new Set(filteredLinks));

        // Extract the total search results
        const totalSearchResults = await page.evaluate(() => {
            return document.querySelector('#result-stats').textContent;
        });

        // Get the HTML code of the page
        const htmlCode = await page.content();
        const compressedHtmlCode = zlib.deflateSync(htmlCode);

        await browser.close();

        const mergedData = {
            keyword,
            totalAdWordsAdvertisers: adWordsAdvertisers,
            totalLinks: uniqueLinks.length,
            totalSearchResults,
            htmlCode: compressedHtmlCode
        };

        return mergedData;
    } catch (error) {
        console.error('Error while scraping Google:', error);
        throw error;
    }
}

module.exports = { scrapeGoogle };