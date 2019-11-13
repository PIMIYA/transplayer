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
    })
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
    async scrollAndClickElement(id, element) {
        if (element.constructor.name !== 'WebElement') {
            element = await this.getWebElement(0, element);
        }

        if (!element) {
            // console.log('not element')
            return;
        }

        let driver = await this.getWebDriver(id);
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
        // 讓 getWebDriver 強制等待不能同時建立，避免抓到錯誤的 chrome pid
        while (this.isCreating) {
            await sleep(100);
        }

        this.isCreating = true;
        try {
            const TIMEOUT = 1000 * 5;

            createIfNotExists = (createIfNotExists === undefined | createIfNotExists) ?
                true :
                false;

            let useLocalProfile = (this.useLocalProfile === undefined | this.useLocalProfile) ?
                true :
                false;

            if (!this.browsers[id]) {
                if (!createIfNotExists) {
                    console.error(`1 Get a null driver ${id}`);
                    return null;
                }

                this.browsers[id] = Controller.__createDefaultBrowser();

                let options = new Options();
                // chrome options
                var args = ["--proxy-server='direct://'",
                    "--proxy-bypass-list=*",
                    '--disable-notifications',
                    '--disable-infobars',
                    '--app=https://www.google.com',
                    '--mute-audio',
                ];
                if (useLocalProfile) {
                    let home_dir = os.homedir();
                    let full_path = path.join(home_dir, "/AppData/Local/Google/Chrome/User Data", `se_${id}`);
                    args.push(`--user-data-dir=${full_path}`);
                }
                options.addArguments(args);
                //options.addExtensions('../uBlock-Origin_v1.23.0.crx');
                options.excludeSwitches(['enable-automation']);

                // firefox options
                // options.setPreference("dom.webnotifications.enabled", false);
                // options.addExtensions('./bin/firefox/ublock_origin-1.23.0-an+fx.xpi');
                // options.setProfile('../../../wayne/AppData/Roaming/Mozilla/Firefox/Profiles/4njbibcw.SE');
                let usedBrowser = 'chrome';
                let lastBrowserPids = (await Utils.getPID(usedBrowser)).map(p => p.pid);
                this.browsers[id].driver = await new Builder()
                    .forBrowser(usedBrowser)
                    .setChromeService(serviceBuilder)
                    .setChromeOptions(options)
                    // .forBrowser('firefox')
                    // .setFirefoxService(serviceBuilder)
                    // .setFirefoxOptions(options)
                    .build();
                let newBrowserPids = (await Utils.getPID(usedBrowser)).map(p => p.pid);

                let createdPid = newBrowserPids.filter(v => !lastBrowserPids.includes(v));
                if (createdPid.length > 0) {
                    this.browsers[id].pid = createdPid[0];
                }

                await this.browsers[id].driver.manage().setTimeouts({
                    implicit: TIMEOUT
                });
            }

            if (this.browsers[id].driver == undefined ||
                this.browsers[id].driver == null) {
                console.error(`2 Get a null driver ${id}`);
            }

            // console.log(this.browsers[id]);
            return this.browsers[id].driver;
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
        try {
            let driver = await this.getWebDriver(id);
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
        try {
            if (by === undefined) {
                by = By.tagName('a');
            }

            let el = await this.getWebElement(id, by, index);
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
        try {
            let driver = await this.getWebDriver(id, true);
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
        try {
            let driver = await this.getWebDriver(id, false);
            if (driver) {
                this.browsers[id] = null;
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
     * @param {number} id
     * @param {string} url
     *
     * @returns {Promise<boolean>}
     */
    async goTo(id, url) {
        try {
            let driver = await this.getWebDriver(id);
            if (!driver) {
                return false;
            }

            if (this.browsers[id].scrollState == 0) {
                await this.breakScroll(id);
            }

            await driver.get(url);
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    _scrollState = 0;
    /**
     *
     * @param {number} id
     * @param {number} pixelHeight
     */
    async scrollTo(id, pixelHeight) {
        try {
            let driver = await this.getWebDriver(id);
            if (!driver) {
                return;
            }

            this.browsers[id].scrollState = 0;
            let gap = Math.floor(pixelHeight / this.SCROLL_GAP);
            for (let i = 0; i < gap; i++) {
                // console.log(this.browsers[id].scrollState);
                if (this.browsers[id].scrollState != 0) {
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
            this.browsers[id].scrollState = -1;
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
        if (this.browsers[id] === undefined || this.browsers[id] == null) {
            return false;
        }

        this.browsers[id].scrollState = -2;
        while (true) {
            if (this.browsers[id].scrollState == -1) {
                break;
            }
            await sleep(500);
        }

        return true;
    }

    /**
     *
     * @param {number} id
     */
    async maximizeBrowser(id) {
        try {
            let driver = await this.getWebDriver(id);
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
        // console.log(rect);
        try {
            let driver = await this.getWebDriver(id);
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
        try {
            let driver = await this.getWebDriver(id);
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
        try {
            let driver = await this.getWebDriver(id);
            if (!driver) {
                return false;
            }

            let el = await this.getWebElement(id, byLocator);
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
        try {
            option = option || {};
            let offset = option.offset || {
                x: 0,
                y: 0
            };
            offset.x = offset.x !== undefined ? offset.x : 0;
            offset.y = offset.y !== undefined ? offset.y : 0;
            let justClick = option.justClick !== undefined ? option.justClick : false;

            let driver = await this.getWebDriver(id);
            if (!driver) {
                return false;
            }

            let el = await this.getWebElement(id, byLocator, index);
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

    /**
     * Scroll google image 結果中右邊的詳細內框
     * @param {number} id
     * @param {number} offset scroll pixel
     *
     * @returns {Promise<boolean>}
     */
    async scrollGoogleImagePageSearchTo(id, offset) {
        return await this.scrollTo(id, offset);
    }

    /**
     * Scroll google image 結果中右邊的詳細內框
     * @param {number} id
     * @param {number} offset scroll pixel
     *
     * @returns {Promise<boolean>}
     */
    async scrollGoogleImagePageIrcTo(id, offset) {
        const script = `
        let el = document.getElementById('irc-ss');
        if(el) el.scroll(0, ${offset});
        `;

        return await this.executeScript(id, script);
    }

    /**
     *
     * @param {number} id
     *
     * @returns {Promise<boolean>}
     */
    async clickRandomGoogleImageResult(id) {
        const by = By.xpath("//div[@id='rg_s']//a/img");
        return await this.clickRandomElement(id, by);
    }

    /**
     *
     * @param {number} id
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
     * @param {number} id
     *
     * @returns {Promise<string>}
     */
    async getRandomGoogleSearchResultUrl(id) {
        const by = By.xpath(this.XPATH_GOOGLE_SEARCH_RESULT_URL);
        return await this.getLinkUrl(id, by);
    }

    /**
     *
     * @param {number} id
     * @param {number} index
     *
     * @returns {Promise<string>}
     */
    async getGoogleSearchResultUrl(id, index) {
        const by = By.xpath(this.XPATH_GOOGLE_SEARCH_RESULT_URL);
        return await this.getLinkUrl(id, by, index);
    }

    /**
     *
     * @param {number} id
     *
     * @returns {Promise<string>}
     */
    async getRandomGoogleNewsSearchResultUrl(id) {
        const by = By.xpath(this.XPATH_GOOGLE_NEWS_SEARCH_RESULT_URL);
        return await this.getLinkUrl(id, by);
    }

    /**
     *
     * @param {number} id
     * @param {number} index
     *
     * @returns {Promise<string>}
     */
    async getGoogleNewsSearchResultUrl(id, index) {
        const by = By.xpath(this.XPATH_GOOGLE_NEWS_SEARCH_RESULT_URL);
        return await this.getLinkUrl(id, by, index);
    }

    /**
     *
     * @param {number} id
     * @param {number} index
     *
     * @returns {Promise<string>}
     */
    async getGoogleVideoSearchResultUrl(id, index) {
        const by = By.xpath(this.XPATH_GOOGLE_VIDEO_SEARCH_RESULT_URL);
        return await this.getLinkUrl(id, by, index);
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

        if (!byLocator) {
            return null;
        }

        let driver = await this.getWebDriver(id, true)
        if (driver == null) {
            return null;
        }

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
        if (!byLocator) {
            return false;
        }

        let driver = await this.getWebDriver(id, true)
        if (driver == null) {
            return false;
        }

        let ele = await this.getWebElement(id, byLocator, index);
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
        let driver = await this.getWebDriver(id, true)
        if (driver == null) {
            return false;
        }

        await driver.switchTo().defaultContent();
        return true;
    }

    /**
     *
     * @param {number} id
     */
    async focusBrowser(id) {
        if (!this.browsers[id]) {
            console.error(`failed to focus ${id}`);

            return;
        }

        await sleep(this.SCROLL_INTERVAL + 50);
        Utils.focusWindow(this.browsers[id].pid);
        await sleep(100);
        Utils.focusWindow(this.browsers[id].pid);

        await sleep(50);
    }
}

/** TODO:
 * - 控制 options 關閉 browser 上方控制資訊列
 * - disable logging or using logging library to control the logging level
 * */

module.exports = Controller;