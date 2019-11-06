const { app, BrowserWindow, ipcMain } = require('electron')
const Controller = require('./controller');
const { By } = require('selenium-webdriver');

let controller = new Controller();
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
    console.log('current time in sec: ', currentTime)
    if(currentTime == 0){
      console.log('wait for intro task finished');
      (async ()=>{
        //set up two news pages
        await controller.openBrowser(0);
        await controller.setBrowserRect(0, {x:0, y:0, width:1080, height: 2160});
        await controller.openBrowser(1);
        await controller.setBrowserRect(1, {x:1080, y:0, width:1080, height: 2160});
        //load url in two pages
        await controller.goTo(0, 'https://www.bbc.com/');
        await controller.goTo(1, 'https://www.straitstimes.com/global');
        controller.SCROLL_GAP = 100;
        controller.SCROLL_INTERVAL = 350;
        await controller.goTo(1, 'https://www.straitstimes.com/singapore');
        await controller.scrollTo(0, 7680);
        //let el_bbc = await controller.getWebElement(0, By.xpath('/html/body/div[7]/div/section[9]/div/div/div[1]/div[2]/a'),0);
        //let rect = await el_bbc.getRect();
        await controller.scrollAndClickElement(0, By.xpath('/html/body/div[7]/div/section[9]/div/div/div[1]/div[2]/a'));
        //let el_sig = await controller.getWebElement(1, By.xpath('/html/body/div[7]/div/section/div/section/div/div/div/div/div[2]/div/div/div/div[1]/div/div/div/div/a'),0);
        //await controller.clickElement(1, el_sig,0);
      })();
    }
  }
  previousTime = currentTime
  event.reply('ctrl', 'pause')
});



//delay
const delay = (interval) =>{
  return new Promise((resolve) =>{
    setTimeout(resolve, interval)
  })
}

// TODO: TEST
/* (async () => {
  //await controller.goTo(0, 'https://www.bbc.com/');
  //let el = await controller.getWebElement(0, By.tagName("a"), 200);
  //let el2 = await controller.getWebElement(0, By.xpath('/html/body/div[7]/div/section[9]/div/div/div[1]/div[2]/a'),0);

  //let rect = await el2.getRect();
  //console.log(rect);
  //await controller._scrollAndClickElement(0, el2);
  //await controller.clickElement(0, By.xpath('/html/body/div[3]/div[6]'),0);
  //await controller.clickElement(0, By.className('p_hiddenElement'),0)
  // let url = await controller.getGoogleSearchResultUrl(0, 0);
  // console.log(`${url}`);
  // url = await controller.getGoogleSearchResultUrl(0, 1);
  // console.log(`${url}`);
  // url = await controller.getGoogleSearchResultUrl(0, 2);
  // console.log(`${url}`);

  console.log(`done`);
})(); */
