const Controller = require('./controller');
const {
    By
} = require('selenium-webdriver');

let controller = new Controller();

(async () => {
    console.log('start test');


    await controller.openBrowser(0);
    controller.setBrowserRect(0, {
        x: -10,
        y: -80,
        width: 1098,
        height: 2300
    })


    console.log('end test');
})();



// delay
const delay = (interval) => {
    return new Promise((resolve) => {
        setTimeout(resolve, interval)
    });
}