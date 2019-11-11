const Controller = require('./controller');
const {
    By
} = require('selenium-webdriver');

let controller = new Controller();

(async () => {
    console.log('start test');
    await controller.goTo(2, 'https://www.bbc.com/');
    await controller.goTo(0, 'https://www.bbc.com/');
    controller.SCROLL_GAP = 50;
    controller.SCROLL_INTERVAL = 50;
    await controller.scrollAndClickElement(0, By.xpath('/html/body/div[7]/div/section[9]/div/div/div[1]/div[2]/a'));
    await controller.switchToFrame(0, By.id('smphtml5iframeplayer'));
    await delay(500);
    await controller.clickElement(0, By.id('mediaContainer'), 0);
    await delay(500);
    await controller.clickElement(0, By.xpath('/html/body/div[3]/div[7]/div[1]/div[1]/button/div[2]'), 0);
    delay(500);
    await controller.clickElement(0, By.xpath('/html/body/div[3]/div[7]/div[1]/div[1]/button/div[2]/svg'), 0);
    await controller.switchToDefault(0);
    await controller.focusBrowser(2);

    console.log('end test');
})();



// delay
const delay = (interval) => {
    return new Promise((resolve) => {
        setTimeout(resolve, interval)
    });
}