const Controller = require('./controller');
const {
    By
} = require('selenium-webdriver');

let controller = new Controller();

(async () => {
    console.log('start test');

    await controller.goTo(4, 'https://www.google.com/search?biw=1440&bih=798&tbm=isch&sxsrf=ACYBGNRTTuCKjScRQgUZ4o6dyeqyGTGiPQ%3A1572502440570&sa=1&ei=qHu6XeW0IsqXr7wPoqWP8A8&q=Elephant+in+Keddah+or+Corral+painting&oq=Elephant+in+Keddah+or+Corral+painting&gs_l=img.3...12020.14881..15049...0.0..0.71.466.9......0....1..gws-wiz-img.3cGEqTlU0qw&ved=0ahUKEwjlqIOL7MXlAhXKy4sBHaLSA_4Q4dUDCAc&uact=5')

    await controller.goTo(4, 'https://www.google.com/search?q=elephant+violent&sxsrf=ACYBGNT0ATjLqewVNHwCw8SUMYSK9txqZw:1572503984349&source=lnms&tbm=isch&sa=X&ved=0ahUKEwiaiJTr8cXlAhUUJqYKHXNaBiMQ_AUIEigB&cshid=1572504257743713&biw=1440&bih=798&dpr=2');
    await controller.scrollTo(4, 3000);
    await controller.goTo(6, 'https://www.youtube.com/results?search_query=elephant+violent&sp=CAMSAhAB');
    let url_el_violent = await controller.getLinkUrl(6, By.id('video-title'), 0);
    await controller.goTo(6, url_el_violent + '&wide=1');
    await controller.goTo(7, 'https://www.youtube.com/results?search_query=elephant+violent&sp=CAMSBAgFEAE%253D');
    let url_el_violent_y = await controller.getLinkUrl(7, By.id('video-title'), 2);
    await controller.goTo(7, url_el_violent_y + '&wide=1');

    console.log('end test');
})();



// delay
const delay = (interval) => {
    return new Promise((resolve) => {
        setTimeout(resolve, interval)
    });
}