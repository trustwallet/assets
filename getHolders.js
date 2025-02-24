import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto('https://bscscan.com/token/0x562b07E9f73Dabbc737Ec669f474B9516cD94D63#balances', { waitUntil: 'networkidle2' });

    // Scrape jumlah holders
    const holders = await page.evaluate(() => {
        const holdersElement = document.querySelector('.mr-3'); // Pastikan class ini benar
        return holdersElement ? holdersElement.innerText : "Not Found";
    });

    console.log("Jumlah Holders:", holders);

    await browser.close();
})();
