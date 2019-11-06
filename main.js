const { app, BrowserWindow, ipcMain } = require('electron')
const Controller = require('./controller');

let win
let previousTime

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 640,
    height: 480,
    transparent: true,
    frame: false,
    fullscreen: true,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true
    }
  });

  //add mouse press through
  win.setIgnoreMouseEvents(true)

  // and load the index.html of the app.
  win.loadFile('app/index.html')

  // Open the DevTools.
  //win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

//enable hardware acceleration
app.disableHardwareAcceleration();

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    // client.end();
    app.quit()
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
});

ipcMain.on('timecode', (event, arg)=>{

  currentTime = Math.trunc(arg)
  if (currentTime != previousTime){
    console.log(currentTime)
    let controller = new Controller();
    if(currentTime == 0){
      (async()=>{
        await controller.openBrowser(0);
        //await controller.maximizeBrowser(0);
        await controller.setBrowserRect(0, {x:0, y:-50, height:1925, width:2165});
        await controller.goTo(0, 'https://www.google.com/search?biw=1440&bih=798&tbm=isch&sxsrf=ACYBGNT_rUSmalUS6R34zPF8dOP-8X2iGw%3A1572500280528&sa=1&ei=OHO6Xc_rH-S2mAWoobRQ&q=map+of+melaka+fort&oq=map+of+melaka+fort&gs_l=img.3...2682.4688..4911...0.0..0.75.359.7......0....1..gws-wiz-img.wi4Ueu-el5k&ved=0ahUKEwjP54SF5MXlAhVkG6YKHagQDQoQ4dUDCAc&uact=5#imgrc=_');
        await controller.scrollTo(0, 7000);
        /* await controller.openBrowser(0);
        await controller.openBrowser(1);
        await controller.setBrowserRect(0, {x:0, y:0, height:1920, width:1080});
        await controller.setBrowserRect(1, {x:1080, y:0, height:1920, width:1080});
        await controller.goTo(0, 'https://www.bbc.com');
        await controller.goTo(1, 'https://www.straitstimes.com');
        await controller.scrollTo(0, 7824);
        await controller.goTo(1, 'https://www.straitstimes.com/singapore');
        //play bbc feature video
        //let ele_bbcvideo =await controller._getWebElement(0, By.XPATH('/html/body/div[7]/div/section[9]/div/div/div[1]/div[2]/a',0)
        //await controller._scrollAndClickElement(0, ele_bbcvideo);
        //clicksingapore top news
        //await controller._scrollAndClickElement(1, '/html/body/div[9]/div/section/div/section/div/div/div/div/div[2]/div/div/div/div[1]/div/div/div/div/a');
        await controller.goTo(1, 'https://www.straitstimes.com/singapore/transport/parliament-e-scooters-to-be-banned-from-footpaths-from-nov-5');
        await controller.openBrowser(2);
        await controller.setBrowserRect(2, {x:1000, y:640, height:800, width:800});
        //await controller.goTo(2, 'https://www.google.com/search?q=elephant');
        //temp
        await controller.goTo(2, 'https://www.bbc.com/news/uk-england-norfolk-50250739');
        await controller.scrollTo(2, 200);

        await controller.openBrowser(3);
        await controller.setBrowserRect(3, {x:100, y:100, height:800, width:800});
        await controller.goTo(3, 'https://www.google.com/search?q=elephant');
        let url = await controller.getGoogleSearchResultUrl(3, 1);
        await controller.goTo(3, url);

        //close broswery
        await controller.closeBrowser(2);
        await delay(3000);
        await controller.closeBrowser(3);
        await delay(3000);
        await controller.closeBrowser(1);
        await delay(3000);
        await controller.closeBrowser(0);  */
      })();
    }

    if(currentTime == 60){
      /* (async()=>{
        await controller.openBrowser(0);
        await controller.maximizeBrowser(0);
        await controller.goTo(0, 'https://www.google.com/search?biw=1440&bih=798&tbm=isch&sxsrf=ACYBGNQQsBvgZwqToOA7UAOcJN-8iSQVdw%3A1572495124539&sa=1&ei=FF-6XdexIJPpmAWzxIT4Ag&q=Telecom+tower&oq=Telecom+tower&gs_l=img.3..0i19l10.40579.40579..40997...0.0..0.47.47.1......0....2j1..gws-wiz-img.dr-TaZ-ge80&ved=0ahUKEwjXi7zq0MXlAhWTNKYKHTMiAS8Q4dUDCAc&uact=5');
      })(); */
      //let ele_a = await controller._getWebElement(0,By.Xpath(''))
    }
  }
  previousTime = currentTime
});


const delay = (interval) =>{
  return new Promise((resolve) =>{
    setTimeout(resolve, interval)
  })
}

// TODO: TEST
<<<<<<< Updated upstream
(async () => {
  const { By } = require('selenium-webdriver');

=======
/* (async () => {
>>>>>>> Stashed changes
  let controller = new Controller();
  // await this.goTo(0, 'https://www.google.com.tw/search?tbm=isch&hl=en&q=meerkat');
  await controller.goTo(0, 'https://www.bbc.com/');
  let el = await controller.getWebElement(0, By.tagName("a"), 200);

  let rect = await el.getRect();
  console.log(rect);

  await controller._scrollAndClickElement(0, el);
  // let url = await controller.getGoogleSearchResultUrl(0, 0);
  // console.log(`${url}`);
  // url = await controller.getGoogleSearchResultUrl(0, 1);
  // console.log(`${url}`);
  // url = await controller.getGoogleSearchResultUrl(0, 2);
  // console.log(`${url}`);

  console.log(`done`);
})(); */
