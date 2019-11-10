const {
    By
} = require('selenium-webdriver');

const Controller = require('./controller');

let controller = new Controller();
controller.useLocalProfile = false;

// delay
const delay = (interval) => {
    return new Promise((resolve) => {
        setTimeout(resolve, interval)
    });
}

(async () => {
    console.log('start test');

    await controller.openBrowser(0);
    await delay(3000);
    await controller.focusBrowser(0);

    // await controller.goTo(0, 'https://www.youtube.com/results?search_query=elephant+violent&sp=CAMSAggF');
    // let url = await controller.getLinkUrl(0, By.id('video-title'), 0);
    // console.log(url+'&wide=1');

    console.log('end test');
})();