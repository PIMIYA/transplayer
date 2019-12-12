const Controller = require('./controller');

const {
    By
} = require('selenium-webdriver');

const delay = (interval) => {
    return new Promise((resolve) => {
        setTimeout(resolve, interval)
    });
}

let controller = new Controller();
let display_width = 2160
let display_height = 1920

async function main() {
    await controller.goTo(5, 'https://www.google.com/search?client=firefox-b-d&biw=1082&bih=884&tbm=vid&ei=ITnEXcGXHaSUmAXZmJCoBg&q=telecom+tower&oq=telecom+tower&gs_l=psy-ab.3..0i19k1l10.2108.5144.0.5281.13.11.0.2.2.0.64.569.11.11.0....0...1c.1.64.psy-ab..0.13.578...0j0i131k1j0i3k1j0i10k1j0i30k1j0i10i19k1.0.BJHO7TxPpVw');
    let url_tower = await controller.getGoogleVideoSearchResultUrl(5, 0);
    controller.goTo(5, url_tower);
    controller.playYoutubeVideo(5);
};

main();