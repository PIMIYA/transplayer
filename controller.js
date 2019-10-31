const { Builder, By, Key, until, WebDriver, WebElement } = require('selenium-webdriver');
const path = require('path');
const { ServiceBuilder } = require('selenium-webdriver/chrome');

const driverPath = path.join(__dirname, './bin/chrome/chromedriver.exe');
const serviceBuilder = new ServiceBuilder(driverPath);

function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}

class Controller {
    SCROLL_GAP = 300;
    SCROLL_INTERVAL = 250;

    XPATH_GOOGLE_SEARCH_RESULT_URL = "//div[contains(@class, 'srg')]//div[@class='g']/div/div[@class='rc']/div[@class='r']/a[1]";

    constructor() {
        /** @type {object.<number|string, WebDriver>} */
        this.webDrivers = {};
    }

    /**
     *
     * @param {number|string} id
     * @param {By} byLocator
     * @param {number} index if index < 0 or undefined, it will get the random link
     *
     * @returns {Promise<WebElement|null>}
     */
    async _getWebElement(id, byLocator, index) {
        function getRandomInt(max) {
            return Math.floor(Math.random() * Math.floor(max));
        }

        if (!byLocator) {
            return null;
        }

        let driver = await this._getWebDriver(id, false)
        if (driver == null) {
            return null;
        }

        let links = await driver.findElements(byLocator);
        if (links.length === 0) {
            console.warn(`Can not get any link(s) from: ${byLocator.toString()}`);
            return null;
        }

        console.log(`link length: ${links.length}`);
        if (index === undefined | isNaN(index)) { index = -1; }
        if (index < 0) {
            // by random
            index = getRandomInt(links.length);
        } else {
            // by index
            index = Math.min(index, links.length - 1);
        }

        console.log(`Get index: ${index}`);
        return links[index];
    }

    async _getPageHeight(id) {
        let driver = await this._getWebDriver(id);
        if (!driver) {
            return;
        }

        return await driver.executeScript("return document.body.scrollHeight");
    }

    /**
     *
     * @param {number|string} id
     * @param {WebElement} element
     */
    async _scrollAndClickElement(id, element) {
        if (!element) {
            return;
        }

        let driver = await this._getWebDriver(id);
        if (!driver) {
            return;
        }
        let rect = await element.getRect();
        let gap = Math.floor(rect.y / this.SCROLL_GAP);
        for (let i = 0; i < gap; i++) {
            await driver.executeScript(`window.scrollBy(0, ${this.SCROLL_GAP})`);
            // TODO: random sleep time maybe
            await sleep(this.SCROLL_INTERVAL)
        }

        await driver.actions({ bridge: true })
            .move({ duration: 50, origin: element, x: 0, y: 0 })
            .click()
            .perform();
    }

    /**
     *
     * @param {number|string} id
     * @param {boolean} createIfNotExists
     *
     * @returns {Promise<WebDriver|null>}
     */
    async _getWebDriver(id, createIfNotExists) {
        createIfNotExists = (createIfNotExists === undefined | createIfNotExists) ?
            true :
            false;
        if (!this.webDrivers[id]) {
            if (!createIfNotExists) {
                console.error("Get a null driver");
                return null;
            }
            this.webDrivers[id] = await new Builder()
                .forBrowser('chrome')
                .setChromeService(serviceBuilder)
                .build();
        }

        if (!this.webDrivers[id]) {
            console.error("Get a null driver");
        }

        return this.webDrivers[id];
    }

    /**
     *
     * @param {number|string} id
     * @param {string} script
     *
     * @returns {Promise<boolean>}
     */
    async _executeScript(id, script) {
        try {
            let driver = await this._getWebDriver(id);
            if (!driver) { return false; }

            await driver.executeScript(script);
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    /**
     *
     * @param {number|string} id
     * @param {By|null} by if null, the default value is By.tagName('a')
     * @param {number|null} index if index < 0 or undefined, it will get the random link
     *
     * @returns {Promise<string>}
     */
    async _getLinkUrl(id, by, index) {
        try {
            if (by === undefined) {
                by = By.tagName('a');
            }

            let el = await this._getWebElement(id, by, index);
            if (!el) { return; }

            return await el.getAttribute('href');
        } catch (error) {
            console.error(error);
            return;
        }
    }

    /**
     *
     * @param {number|string} id
     *
     * @returns {Promise<boolean>}
     */
    async openBrowser(id) {
        try {
            let driver = await this._getWebDriver(id, true);
            return !!driver;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    /**
     *
     * @param {number|string} id
     *
     * @returns {Promise<boolean>}
     */
    async closeBrowser(id) {
        try {
            let driver = await this._getWebDriver(id, false);
            if (driver) {
                this.webDrivers[id] = null;
                driver.close();
            }

            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    /**
     *
     * @param {number|string} id
     * @param {string} url
     *
     * @returns {Promise<boolean>}
     */
    async goTo(id, url) {
        try {
            let driver = await this._getWebDriver(id);
            if (!driver) { return false; }

            await driver.get(url);
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    /**
     *
     * @param {number|string} id
     * @param {number} pixelHeight
     */
    async scrollTo(id, pixelHeight) {
        try {
            let driver = await this._getWebDriver(id);
            if (!driver) {
                return;
            }

            let gap = Math.floor(pixelHeight / this.SCROLL_GAP);
            for (let i = 0; i < gap; i++) {
                await driver.executeScript(`window.scrollBy(0, ${this.SCROLL_GAP})`);
                await sleep(this.SCROLL_INTERVAL)
            }
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    /**
     *
     * @param {number|string} id
     */
    async maximizeBrowser(id) {
        try {
            let driver = await this._getWebDriver(id);
            if (!driver) { return false; }

            await driver.manage().window().maximize();

            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    /**
     *
     * @param {number|string} id
     * @param {{x: number, y: number, width: number, height: number}} rect
     *
     * @returns {Promise<boolean>}
     */
    async setBrowserRect(id, rect) {
        try {
            let driver = await this._getWebDriver(id);
            if (!driver) { return false; }

            await driver.manage().window().setRect(rect);
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    /**
     *
     * @param {number|string} id
     * @param {By} byLocator
     */
    async clickRandomElement(id, byLocator) {
        try {
            let driver = await this._getWebDriver(id);
            if (!driver) { return false; }

            let el = await this._getWebElement(id, byLocator);
            if (!el) { return false; }

            await driver.actions({ bridge: true })
                .move({ x: 0, y: 0, origin: el })
                .click(el)
                .perform();

            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    /**
     *
     * @param {number|string} id
     * @param {By} byLocator
     * @param {number} index
     */
    async clickElement(id, byLocator, index) {
        try {
            let driver = await this._getWebDriver(id);
            if (!driver) { return false; }

            let el = await this._getWebElement(id, byLocator, index);
            if (!el) { return false; }

            await driver.actions({ bridge: true })
                .move({ x: 0, y: 0, origin: el })
                .click(el)
                .perform();

            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    /**
     * Scroll google image 結果中右邊的詳細內框
     * @param {number|string} id
     * @param {number} offset scroll pixel
     *
     * @returns {Promise<boolean>}
     */
    async scrollGoogleImagePageSearchTo(id, offset) {
        return await this.scrollTo(id, offset);
    }

    /**
     * Scroll google image 結果中右邊的詳細內框
     * @param {number|string} id
     * @param {number} offset scroll pixel
     *
     * @returns {Promise<boolean>}
     */
    async scrollGoogleImagePageIrcTo(id, offset) {
        const script = `
        let el = document.getElementById('irc-ss');
        if(el) el.scroll(0, ${offset});
        `;

        return await this._executeScript(id, script);
    }

    /**
     *
     * @param {number|string} id
     *
     * @returns {Promise<boolean>}
     */
    async clickRandomGoogleImageResult(id) {
        const by = By.xpath("//div[@id='rg_s']//a/img");
        return await this.clickRandomElement(id, by);
    }

    /**
     *
     * @param {number|string} id
     * @param {number} index
     *
     * @returns {Promise<boolean>}
     */
    async clickGoogleImageResult(id, index) {
        const by = By.xpath("//div[@id='rg_s']//a/img");
        return await this.clickElement(id, by, index);
    }

    /**
     *
     * @param {number|string} id
     *
     * @returns {Promise<string>}
     */
    async getRandomGoogleSearchResultUrl(id) {
        const by = By.xpath(this.XPATH_GOOGLE_SEARCH_RESULT_URL);
        return await this._getLinkUrl(id, by);
    }

    /**
     *
     * @param {number|string} id
     * @param {number} index
     *
     * @returns {Promise<string>}
     */
    async getGoogleSearchResultUrl(id, index) {
        const by = By.xpath(this.XPATH_GOOGLE_SEARCH_RESULT_URL);
        return await this._getLinkUrl(id, by, index);
    }

    // TODO: test
    async run() {
        // await this.goTo(0, 'https://www.google.com.tw/search?tbm=isch&hl=en&q=meerkat');
        await this.goTo(0, 'https://www.google.com/search?q=meerkat');
        let url = await this.getGoogleSearchResultUrl(0, 0);
        console.log(`${url}`);
        url = await this.getGoogleSearchResultUrl(0, 1);
        console.log(`${url}`);
        url = await this.getGoogleSearchResultUrl(0, 2);
        console.log(`${url}`);
        console.log(`done`);
    }
}

/** TODO:
 * - 控制 options 關閉 browser 上方控制資訊列
 * */

module.exports = Controller;