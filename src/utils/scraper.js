const puppeteer = require('puppeteer');
const zlib = require('zlib');

async function scrapeGoogle(browser, keyword) {
    try {
        const page = await browser.newPage();

        console.log(`Loading page for keyword : ${keyword}`);

        await page.goto(`https://www.google.com/search?q=${encodeURIComponent(keyword)}`);

        // Wait for the required elements to be rendered on the page
        await Promise.all([
            page.waitForSelector('#tads > div', { timeout: 5000 }).catch(() => { }),
            page.waitForSelector('#rso', { timeout: 5000 }).catch(() => { }),
            page.waitForSelector('#result-stats', { timeout: 5000 }).catch(() => { })
        ]);
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
        const compressedHtmlCode = zlib.gzipSync(htmlCode).toString('base64');

        await page.close();

        console.log(`Data retrieved for keyword : ${keyword}`);

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

async function scrapeMultipleKeywords(keywords) {
    const browser = await puppeteer.launch({
        headless: 'new'
    });

    const scrapedResults = await Promise.all(
        keywords.map(async keyword => {
            const result = await scrapeGoogle(browser, keyword);
            return result;
        })
    );

    await browser.close();

    return scrapedResults;
}

module.exports = { scrapeMultipleKeywords };