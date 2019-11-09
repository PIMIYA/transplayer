const Controller = require('./controller');
const {
    By
} = require('selenium-webdriver');

let controller = new Controller();

(async () => {
    console.log('start test');
    await controller.goTo(4, 'https://www.google.com/search?q=History+and+Ethnography+Museum&sxsrf=ACYBGNQP5pBdzmb24hL-nwVLtFIrc2FYEQ:1572504658222&source=lnms&tbm=isch&sa=X&ved=0ahUKEwjO972s9MXlAhW1yosBHWrLDWgQ_AUIEygC&biw=1440&bih=798');
    //await controller.scrollTo(4, 500);
    await controller.goTo(10, 'https://www.youtube.com/results?search_query=History+and+Ethnography+Museum+melaka&sp=CAM%253D');
    // await controller.setBrowserRect(10, {
    //   x: 300,
    //   y: 300,
    //   width: 1024,
    //   height: 768
    // });
    await controller.clickElement(10, By.id('video-title'), 0);


    console.log('end test');
})();



// delay
const delay = (interval) => {
    return new Promise((resolve) => {
        setTimeout(resolve, interval)
    });
}