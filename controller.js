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

    constructor() {
        /** @type {Object.<int, WebDriver>} */
        this.webDrivers = {};
    }

    //#region selenium

    /**
     *
     * @param {number} id
     * @param {string} element
     * @param {number} index
     * @returns {WebElement|null}
     */
    async _getWebElement(id, element, index) {
        function getRandomInt(max) {
            return Math.floor(Math.random() * Math.floor(max));
        }

        if (!element) {
            return
        }

        let driver = await this._getWebDriver(id, false)
        if (driver == null) {
            return;
        }

        let links = await driver.findElements(By.tagName(element));
        if (!links) { return; }

        if (index < 0) {
            // by random
            index = getRandomInt(links.length);
        } else {
            // by index
            index = Math.min(index, links.length - 1);
        }

        return links[index];
    }

    /**
     *
     * @param {int} id
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
     * @param {number} id
     * @param {boolean} createIfNotExists
     *
     * @returns {WebDriver|null}
     */
    async _getWebDriver(id, createIfNotExists) {
        createIfNotExists = (createIfNotExists === undefined | createIfNotExists) ?
            true :
            false;
        if (!this.webDrivers[id]) {
            if (!createIfNotExists) {
                return null;
            }
            this.webDrivers[id] = await new Builder()
                .forBrowser('chrome')
                .setChromeService(serviceBuilder)
                .build();
        }

        return this.webDrivers[id];
    }

    async openBrowser(id) {

    }

    async closeBrowser(id) {

    }

    async maximizeBrowser(id) {

    }

    async resizeBrowser(id) {

    }

    async clickRandomElement(id, elementTagName) {

    }

    async clickElement(id, elementTagName, index) {

    }

    async dragBrowser(id, offsetX, offsetY, duration) {

    }

    async moveToBrowserCloseButton(id, duration) {

    }

    //#endregion

    //#region gui
    async mouseMove(x, y, duration = 300) {
        console.log(x, y, duration);

    }

    async mouseClick(x, y, duration = 300) {

    }

    async mouseDoubleClick(x, y, duration = 300) {

    }

    async mouseClickRight(x, y, duration = 300) {

    }

    async keyPress(key, presses = 1, interval = 0.0) {

    }

    async keyTypewrite(text, interval = 0.0) {

    }

    async keyHotkey(key1, key2) {

    }

    //#endregion

    /**
     *
     * @param {int} id
     */
}

module.exports = Controller;