// const { Builder, By, Key, until, WebElement } = require("selenium-webdriver");
// const WebDriver = require("selenium-webdriver");
// //const By = webdriver.By;
// //const until = webdriver.until;

// const path = require("path");
// const os = require("os");

// /** chrome */
// const { ServiceBuilder, Options } = require("selenium-webdriver/chrome");
// //const driverPath = path.join(__dirname, './bin/chrome/chromedriver.exe');
// const driverPath = path.join(__dirname, "./bin/chrome/chromedriver");

// const fs = require("fs");
// const encodeExt = (file) => {
//   const stream = fs.readFileSync(path.resolve(file));
//   return Buffer.from(stream).toString("base64");
// };

// const serviceBuilder = new ServiceBuilder(driverPath);

// var driver = new WebDriver.Builder()
//   .forBrowser("chrome")
//   .setChromeService(serviceBuilder)
//   .build();

// driver.get("http://www.bbc.com/");

const { By } = require("selenium-webdriver");

const Controller = require("./controller");

const delay = (interval) => {
  return new Promise((resolve) => {
    setTimeout(resolve, interval);
  });
};

let controller = new Controller();
