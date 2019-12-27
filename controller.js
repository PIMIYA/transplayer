const {
    Builder,
    By,
    Key,
    until,
    WebDriver,
    WebElement
} = require('selenium-webdriver');
const path = require('path');
const os = require('os');

/** chrome */
const {
    ServiceBuilder,
    Options
} = require('selenium-webdriver/chrome');
const driverPath = path.join(__dirname, './bin/chrome/chromedriver.exe');

const fs = require('fs');
const encodeExt = file => {
    const stream = fs.readFileSync(path.resolve(file));
    return Buffer.from(stream).toString('base64');
};

/** firefox */
// const {
//     ServiceBuilder,
//     Options
// } = require('selenium-webdriver/firefox');
// const driverPath = path.join(__dirname, './bin/firefox/geckodriver.exe');

const Utils = require('./utils');

const serviceBuilder = new ServiceBuilder(driverPath);

function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    });
}

class Controller {
    SCROLL_GAP = 1;
    SCROLL_INTERVAL = 10;

    XPATH_GOOGLE_SEARCH_RESULT_URL = "//div[contains(@class, 'srg')]//div[@class='g']/div/div[@class='rc']/div[@class='r']/a[1]";
    XPATH_GOOGLE_NEWS_SEARCH_RESULT_URL = `//div[@id="search"]//div[@id="rso"]/div/div[@class="g"]/div/div/h3/a`;
    XPATH_GOOGLE_VIDEO_SEARCH_RESULT_URL = `//div[@id="search"]//div[@class="srg"]/div[@class="g"]/div/div/div/a`;

    constructor() {
        /** @type {Object.<number, {driver: WebDriver|null, scrollState: number, pid: number}>} */
        this.browsers = {};

        /** @type {boolean} default is true */
        this.useLocalProfile = true;
    }

    async getPageHeight(id) {
        let driver = await this.getWebDriver(id);
        if (!driver) {
            return;
        }

        return await driver.executeScript("return document.body.scrollHeight");
    }

    /**
     *
     * @param {number} id
     * @param {WebElement|By} element
     */
    async scrollAndClickElementByXPath(id, xpath) {
        const MaxTry = 5;

        let staleElement = true;
        let result;
        let cnt = 0;

        while (staleElement) {
            cnt++;
            if (cnt > MaxTry) {
                break;
            }

            try {
                let ele = By.xpath(xpath);
                result = await this.scrollAndClickElement(id, ele);
                staleElement = false;
            } catch (e) {
                staleElement = true
            }
        }

        return result;
    }

    /**
     *
     * @param {number} id
     * @param {WebElement|By} element
     */
    async scrollAndClickElement(id, element) {
        let theId = id;
        if (element.constructor.name !== 'WebElement') {
            element = await this.getWebElement(0, element);
        }

        if (!element) {
            // console.log('not element')
            return;
        }

        let driver = await this.getWebDriver(theId);
        if (!driver) {
            return;
        }

        let currentOffsetY = await driver.executeScript("return window.pageYOffset;");

        let rect = await element.getRect();
        let count = Math.floor(rect.y / this.SCROLL_GAP);
        let gap = this.SCROLL_GAP * (rect.y > currentOffsetY ? 1 : -1);
        if (Math.abs(rect.y - currentOffsetY) <= this.SCROLL_GAP) {
            count = 0;
        }

        for (let i = 0; i < count; i++) {
            await driver.executeScript(`window.scrollBy(0, ${gap})`);
            // TODO: random sleep time maybe
            await sleep(this.SCROLL_INTERVAL)
        }
        // await driver.executeScript("arguments[0].scrollIntoView();", element);
        currentOffsetY = await driver.executeScript("return window.pageYOffset;");
        let reminderGap = rect.y - currentOffsetY;
        await driver.executeScript(`window.scrollBy(0, ${reminderGap})`);

        await driver.actions({
                bridge: true
            })
            .move({
                duration: 50,
                origin: element,
                x: 0,
                y: 0
            })
            .click(element)
            .perform();
    }

    /**
     * @returns {Promise<Array.<number>>}
     */
    async getAllDriverId() {
        let result = [];
        var keys = Object.keys(this.browsers);
        keys.forEach(key => {
            if (this.browsers[parseInt(key)]) {
                result.push(this.browsers[parseInt(key)].pid);
            }
        });

        return result;
    }

    /**
     * @return {{driver: WebDriver|null, scrollState: number, pid: number}}
     */
    static __createDefaultBrowser() {
        return {
            driver: null,
            scrollState: -1,
            driverPid: 0
        };
    }
    isCreating = false;
    /**
     *
     * @param {number} id
     * @param {boolean} createIfNotExists default is `true`
     *
     * @returns {Promise<WebDriver|null>}
     */
    async getWebDriver(id, createIfNotExists) {
        let theId = id;
        // 讓 getWebDriver 強制等待不能同時建立，避免抓到錯誤的 chrome pid
        while (this.isCreating) {
            await sleep(50);
        }
        this.isCreating = true;
        let lastBrowserPids = await this.getAllDriverId();
        console.log(theId, lastBrowserPids);

        try {
            const TIMEOUT = 1000 * 5;

            createIfNotExists = (createIfNotExists === undefined | createIfNotExists) ?
                true :
                false;

            let useLocalProfile = (this.useLocalProfile === undefined | this.useLocalProfile) ?
                true :
                false;

            if (!this.browsers[theId]) {
                if (!createIfNotExists) {
                    console.error(`1 Get a null driver ${theId}`);
                    return null;
                }

                this.browsers[theId] = Controller.__createDefaultBrowser();

                let options = new Options();
                // chrome options
                var args = [
                    '--disable-notifications',
                    '--disable-infobars',
                    '--app=https://www.google.com',
                    '--mute-audio'
                ];
                if (useLocalProfile) {
                    let home_dir = os.homedir();
                    let full_path = path.join(home_dir, "/AppData/Local/Google/Chrome/User Data", `se_${theId}`);
                    args.push(`--user-data-dir=${full_path}`);
                }
                var ext = path.join(__dirname, "./1.23.0_0.crx");
                options.addArguments(args);
                if (theId != 4) {
                    options.addExtensions(encodeExt(ext));
                }
                options.excludeSwitches(['enable-automation']);

                // firefox options
                // options.setPreference("dom.webnotifications.enabled", false);
                // options.addExtensions('./bin/firefox/ublock_origin-1.23.0-an+fx.xpi');
                // options.setProfile('../../../wayne/AppData/Roaming/Mozilla/Firefox/Profiles/4njbibcw.SE');
                let usedBrowser = 'chrome';
                this.browsers[theId].driver = await new Builder()
                    .forBrowser(usedBrowser)
                    .setChromeService(serviceBuilder)
                    .setChromeOptions(options)
                    // .forBrowser('firefox')
                    // .setFirefoxService(serviceBuilder)
                    // .setFirefoxOptions(options)
                    .build();

                await this.browsers[theId].driver.manage().setTimeouts({
                    implicit: TIMEOUT
                });

                let newBrowserPids = (await Utils.getPID(usedBrowser)).map(p => p.pid);
                console.log('new', theId, newBrowserPids);
                let createdPid = newBrowserPids.filter(v => !lastBrowserPids.includes(v));
                if (createdPid.length > 0) {
                    this.browsers[theId].pid = createdPid[0];
                }
                console.log(`${theId} => ${this.browsers[theId].pid}`);
            }

            if (this.browsers[theId].driver == undefined ||
                this.browsers[theId].driver == null) {
                console.error(`2 Get a null driver ${theId}`);
            }

            // console.log(this.browsers[id]);
            return this.browsers[theId].driver;
        } finally {
            this.isCreating = false;
        }
    }

    /**
     *
     * @param {number} id
     * @param {string} script
     *
     * @returns {Promise<boolean>}
     */
    async executeScript(id, script) {
        let theId = id;
        try {
            let driver = await this.getWebDriver(theId);
            if (!driver) {
                return false;
            }

            await driver.executeScript(script);
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    /**
     *
     * @param {number} id
     * @param {By|null} by if null, the default value is By.tagName('a')
     * @param {number|null} index if index < 0 or undefined, it will get the random link
     *
     * @returns {Promise<string>}
     */
    async getLinkUrl(id, by, index) {
        let theId = id;
        try {
            if (by === undefined) {
                by = By.tagName('a');
            }

            let el = await this.getWebElement(theId, by, index);
            if (!el) {
                return;
            }

            return await el.getAttribute('href');
        } catch (error) {
            console.error(error);
            return;
        }
    }

    /**
     *
     * @param {number} id
     *
     * @returns {Promise<boolean>}
     */
    async openBrowser(id) {
        let theId = id;
        try {
            let driver = await this.getWebDriver(theId, true);
            return !!driver;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    /**
     *
     * @param {number} id
     *
     * @returns {Promise<boolean>}
     */
    async closeBrowser(id) {
        let theId = id;
        try {
            console.log(`1 close ${id}`);

            if (this.browsers[theId] == undefined || this.browsers[theId] == null) {
                console.log(`2 close ${id}`);
                return true;
            }

            if (this.browsers[theId].driver) {
                console.log(`3 close ${id}`);
                this.browsers[theId].driver.close();
                this.browsers[theId].driver = null;
                this.browsers[theId] = null;
            }
            console.log(`4 close ${id}`);
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    /**
     *
     * @param {number} id
     *
     * @returns {Promise<boolean>}
     */
    async playYoutubeVideo(id) {
        let theId = id;
        try {
            let driver = await this.getWebDriver(theId);
            if (!driver) {
                return false;
            }

            let ele = await driver.findElement(By.className('ytp-play-button'));
            if (!ele) {
                return false;
            }
            await ele.sendKeys('k');

            return true;
        } catch (error) {
            console.error('GET ERROR:');
            console.error(error);
            return false;
        }
    }

    /**
     *
     * @param {number} id
     * @param {string} url
     *
     * @returns {Promise<boolean>}
     */
    async goTo(id, url) {
        let theId = id;
        let theUrl = url;
        try {
            if (typeof theUrl !== 'string') {
                return false;
            }

            let driver = await this.getWebDriver(theId);
            if (!driver) {
                return false;
            }

            // if (this.browsers[id].scrollState == 0) {
            //     await this.breakScroll(id);
            // }

            await driver.get(theUrl);
            return true;
        } catch (error) {
            console.error(`GET ERROR: ${theUrl}`);
            console.error(error);
            return false;
        }
    }

    /**
     *
     * @param {number} id
     * @param {number} pixelHeight
     */
    async scrollTo(id, pixelHeight) {
        let theId = id;
        try {
            let driver = await this.getWebDriver(theId);
            if (!driver) {
                return;
            }

            this.browsers[theId].scrollState = 0;
            let gap = Math.floor(pixelHeight / this.SCROLL_GAP);
            for (let i = 0; i < gap; i++) {
                // console.log(this.browsers[id].scrollState);
                if (this.browsers[theId].scrollState != 0) {
                    // console.log('scroll to is break');
                    break;
                }

                await driver.executeScript(`window.scrollBy(0, ${this.SCROLL_GAP})`);
                await sleep(this.SCROLL_INTERVAL);
            }
        } catch (error) {
            console.error(error);
            return false;
        } finally {
            this.browsers[theId].scrollState = -1;
            return true;
        }
    }

    /**
     *
     * @param {number} id
     *
     * @returns {boolean}
     */
    async breakScroll(id) {
        let theId = id;
        const interval = 50;
        if (this.browsers[theId] === undefined || this.browsers[theId] == null) {
            return false;
        }
        if (this.browsers[theId].scrollState == -1) {
            return true;
        }

        this.browsers[theId].scrollState = -2;
        let waitTime = 0;
        while (true) {
            if (this.browsers[theId].scrollState == -1) {
                break;
            }
            await sleep(interval);
            waitTime += interval;
            if (waitTime >= 1500) {
                break;
            }
        }

        return true;
    }

    /**
     *
     * @param {number} id
     */
    async maximizeBrowser(id) {
        let theId = id;
        try {
            let driver = await this.getWebDriver(theId);
            if (!driver) {
                return false;
            }

            await driver.manage().window().maximize();

            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    /**
     *
     * @param {number} id
     * @param {{x: number, y: number, width: number, height: number}} rect
     *
     * @returns {Promise<boolean>}
     */
    async setBrowserRect(id, rect) {
        let theId = id;
        // console.log(rect);
        try {
            let driver = await this.getWebDriver(theId);
            if (!driver) {
                return false;
            }

            await driver.manage().window().setRect(rect);
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    /**
     *
     * @param {number} id
     * @param {number} zoom zoom level; 1 = 100%, 1.5 = 150%
     *
     * @returns {Promise<boolean>}
     */
    async setBrowserZoom(id, zoom) {
        let theId = id;
        try {
            let driver = await this.getWebDriver(theId);
            if (!driver) {
                return false;
            }

            await driver.executeScript(`document.body.style.zoom = '${zoom}'`);
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    /**
     *
     * @param {number} id
     * @param {By} byLocator
     */
    async clickRandomElement(id, byLocator) {
        let theId = id;
        try {
            let driver = await this.getWebDriver(theId);
            if (!driver) {
                return false;
            }

            let el = await this.getWebElement(theId, byLocator);
            if (!el) {
                return false;
            }

            await driver.actions({
                    bridge: true
                })
                .move({
                    duration: 50,
                    origin: el,
                    x: 0,
                    y: 0
                })
                .click()
                .perform();

            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    /**
     *
     * @param {number} id
     * @param {By} byLocator
     * @param {number} index
     * @param {{offset: {x: number, y: number}, justClick: boolean}} option
     */
    async clickElement(id, byLocator, index = 0, option = {}) {
        let theId = id;
        try {
            option = option || {};
            let offset = option.offset || {
                x: 0,
                y: 0
            };
            offset.x = offset.x !== undefined ? offset.x : 0;
            offset.y = offset.y !== undefined ? offset.y : 0;
            let justClick = option.justClick !== undefined ? option.justClick : false;

            let driver = await this.getWebDriver(theId);
            if (!driver) {
                return false;
            }

            let el = await this.getWebElement(theId, byLocator, index);
            if (!el) {
                return false;
            }
            // console.log(await el.getRect());

            if (justClick) {
                await el.click();
            } else {
                await driver.actions({
                        bridge: true
                    })
                    .move({
                        duration: 50,
                        origin: el,
                        x: offset.x,
                        y: offset.y
                    })
                    .click(el)
                    .perform();
            }

            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    async refresh(id) {
        let theId = id;
        try {
            let driver = await this.getWebDriver(theId);
            if (!driver) {
                return false;
            }
            console.log(`refresh ${theId}`);
            await driver.navigate().refresh();

            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Scroll google image 結果中右邊的詳細內框
     * @param {number} id
     * @param {number} offset scroll pixel
     *
     * @returns {Promise<boolean>}
     */
    async scrollGoogleImagePageSearchTo(id, offset) {
        let theId = id;
        return await this.scrollTo(theId, offset);
    }

    /**
     * Scroll google image 結果中右邊的詳細內框
     * @param {number} id
     * @param {number} offset scroll pixel
     *
     * @returns {Promise<boolean>}
     */
    async scrollGoogleImagePageIrcTo(id, offset) {
        let theId = id;
        const script = `
        let el = document.getElementById('irc-ss');
        if(el) el.scroll(0, ${offset});
        `;

        return await this.executeScript(theId, script);
    }

    /**
     *
     * @param {number} id
     *
     * @returns {Promise<boolean>}
     */
    async clickRandomGoogleImageResult(id) {
        let theId = id;
        const by = By.xpath("//div[@id='rg_s']//a/img");
        return await this.clickRandomElement(theId, by);
    }

    /**
     *
     * @param {number} id
     * @param {number} index
     *
     * @returns {Promise<boolean>}
     */
    async clickGoogleImageResult(id, index) {
        let theId = id;
        const by = By.xpath("//div[@id='rg_s']//a/img");
        return await this.clickElement(theId, by, index);
    }

    /**
     *
     * @param {number} id
     *
     * @returns {Promise<string>}
     */
    async getRandomGoogleSearchResultUrl(id) {
        let theId = id;
        const by = By.xpath(this.XPATH_GOOGLE_SEARCH_RESULT_URL);
        return await this.getLinkUrl(theId, by);
    }

    /**
     *
     * @param {number} id
     * @param {number} index
     *
     * @returns {Promise<string>}
     */
    async getGoogleSearchResultUrl(id, index) {
        let theId = id;
        const by = By.xpath(this.XPATH_GOOGLE_SEARCH_RESULT_URL);
        return await this.getLinkUrl(theId, by, index);
    }

    /**
     *
     * @param {number} id
     *
     * @returns {Promise<string>}
     */
    async getRandomGoogleNewsSearchResultUrl(id) {
        let theId = id;
        const by = By.xpath(this.XPATH_GOOGLE_NEWS_SEARCH_RESULT_URL);
        return await this.getLinkUrl(theId, by);
    }

    /**
     *
     * @param {number} id
     * @param {number} index
     *
     * @returns {Promise<string>}
     */
    async getGoogleNewsSearchResultUrl(id, index) {
        let theId = id;
        const by = By.xpath(this.XPATH_GOOGLE_NEWS_SEARCH_RESULT_URL);
        return await this.getLinkUrl(theId, by, index);
    }

    /**
     *
     * @param {number} id
     * @param {number} index
     *
     * @returns {Promise<string>}
     */
    async getGoogleVideoSearchResultUrl(id, index) {
        const MaxTry = 5;

        let theId = id;
        let result;
        let cnt = 0;

        let by = By.xpath(this.XPATH_GOOGLE_VIDEO_SEARCH_RESULT_URL);
        let staleElement = true;
        while (staleElement) {
            cnt++;
            if (cnt > MaxTry) {
                break;
            }

            try {
                let ytUrl = await this.getLinkUrl(theId, by, index);
                let urlObj = new URL(ytUrl);
                let videoId = urlObj.searchParams.get('v');
                result = `https://www.youtube.com/embed/${videoId}/?&autoplay=1&loop=1`

                staleElement = false;
            } catch (e) {
                staleElement = true
            }
        }

        return result;
    }

    /**
     *
     * @param {number} id
     * @param {By} byLocator
     * @param {number} index if index < 0 or undefined, it will get the random link
     *
     * @returns {Promise<WebElement|null>}
     */
    async getWebElement(id, byLocator, index = 0) {
        function getRandomInt(max) {
            return Math.floor(Math.random() * Math.floor(max));
        }

        let theId = id;

        if (!byLocator) {
            return null;
        }
        if (!this.browsers[theId]) {
            return null;
        }
        if (!this.browsers[theId].driver) {
            return null;
        }

        let driver = this.browsers[theId].driver;

        let links = await driver.findElements(byLocator);
        if (links.length === 0) {
            console.warn(`Can not get any link(s) from: ${byLocator.toString()}`);
            return null;
        }

        // console.log(`link length: ${links.length}`);
        if (index === undefined | isNaN(index)) {
            index = -1;
        }
        if (index < 0) {
            // by random
            index = getRandomInt(links.length);
        } else {
            // by index
            index = Math.min(index, links.length - 1);
        }

        // console.log(`Get index: ${index}`);
        return links[index];
    }

    /**
     *
     * @param {number} id
     * @param {By} byLocator
     * @param {number} index default is 0
     *
     * @returns {Promise<boolean>}
     */
    async switchToFrame(id, byLocator, index = 0) {
        let theId = id;
        if (!byLocator) {
            return false;
        }

        let driver = await this.getWebDriver(theId, true)
        if (driver == null) {
            return false;
        }

        let ele = await this.getWebElement(theId, byLocator, index);
        await driver.switchTo().frame(ele);
        return true;
    }

    /**
     *
     * @param {number} id
     *
     * @returns {Promise<boolean>}
     */
    async switchToDefault(id) {
        let theId = id;
        let driver = await this.getWebDriver(theId, true)
        if (driver == null) {
            return false;
        }

        await driver.switchTo().defaultContent();
        return true;
    }

    doingFocus = false;
    /**
     *
     * @param {number} id
     */
    async focusBrowser(id) {
        let theId = id;
        if (this.browsers[theId] == undefined || this.browsers[theId] == null) {
            return;
        }
        while (this.doingFocus) {
            await sleep(50);
        }
        this.doingFocus = true;
        // console.log(`focus ${theId} ${this.browsers[theId].pid}.`);
        try {
            if (!this.browsers[theId]) {
                console.error(`failed to focus ${theId}`);
                return;
            }
            Utils.focusWindow(this.browsers[theId].pid);
        } catch (e) {
            console.error(e);
        }
        finally {
            console.log(`focus ${theId} ${this.browsers[theId].pid} done.`);
            this.doingFocus = false;
        }
    }

    async closeAllBrowser() {
        var keys = Object.keys(this.browsers);
        keys.forEach(async key => {
            console.log(`close ${key}`);

            await this.closeBrowser(parseInt(key));
        });
    }
}

/** TODO:
 * - 控制 options 關閉 browser 上方控制資訊列
 * - disable logging or using logging library to control the logging level
 * */

module.exports = Controller;