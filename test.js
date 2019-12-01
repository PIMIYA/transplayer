const Controller = require('./controller');

const {
    By
} = require('selenium-webdriver');

let controller = new Controller();
let display_width = 2160
let display_height = 1920

async function main() {
    await controller.goTo(0, 'https://www.bbc.com/');
    await controller.goTo(1, 'https://www.straitstimes.com/singapore');
    await controller.setBrowserRect(0, {
        x: -7,
        y: 0,
        width: display_width / 2 + 14,
        height: display_height + 7
    })
    await controller.setBrowserRect(1, {
        x: display_width / 2 - 7,
        y: 0,
        width: display_width / 2 + 14,
        height: display_height + 7
    })
};

main();