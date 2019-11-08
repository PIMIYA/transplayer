const Controller = require('./controller');
const {
    By
} = require('selenium-webdriver');

let controller = new Controller();

(async () => {
    console.log('start test');

    await controller.openBrowser(0);
    await controller.setBrowserRect(0, {
        x: 0,
        y: 0,
        width: 1080,
        height: 800
    });
    await controller.goTo(0, 'https://www.bbc.com/');
    controller.SCROLL_GAP = 100;
    controller.SCROLL_INTERVAL = 50;
    await controller.scrollTo(0, 7680);
    await controller.scrollAndClickElement(0, By.xpath('/html/body/div[7]/div/section[9]/div/div/div[1]/div[2]/a'));
    await controller.switchToFrame(0, By.id('smphtml5iframeplayer'));
    await delay(1000);
    await controller.clickElement(0, By.id('mediaContainer'), 0);
    await controller.switchToDefault(0);

    console.log('end test');
})();



// delay
const delay = (interval) => {
    return new Promise((resolve) => {
        setTimeout(resolve, interval)
    });
}