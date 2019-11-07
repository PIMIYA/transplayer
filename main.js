const { app, BrowserWindow, ipcMain } = require('electron')
const Controller = require('./controller');
const { By } = require('selenium-webdriver');
const ctrl_state = {};


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
  win.webContents.openDevTools()

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

ipcMain.on('timecode', (event, arg) => {
  //return;
  console.log('current state:', ctrl_state.stat);
  currentTime = Math.trunc(arg)
  if (currentTime != previousTime) {
    console.log('current time in sec: ', currentTime)
    if (currentTime == 0) {
      console.log('wait for intro task finished');
      (async () => {
        //set up two news pages
        await controller.openBrowser(0);
        await controller.setBrowserRect(0, { x: 0, y: 0, width: 1080, height: 2160 });
        await controller.openBrowser(1);
        await controller.setBrowserRect(1, { x: 1080, y: 0, width: 1080, height: 2160 });
        //load url in two pages
        await controller.goTo(0, 'https://www.bbc.com/');
        await controller.goTo(1, 'https://www.straitstimes.com/global');
        controller.SCROLL_GAP = 50;
        controller.SCROLL_INTERVAL = 10;
        await controller.goTo(1, 'https://www.straitstimes.com/singapore');
        await controller.scrollTo(0, 7758);
        await controller.scrollAndClickElement(0, By.xpath('/html/body/div[7]/div/section[9]/div/div/div[1]/div[2]/a'));
        await controller.switchToFrame(0, By.id('smphtml5iframeplayer'));
        await delay(1000);
        await controller.clickElement(0, By.id('mediaContainer'), 0);
        await controller.switchToDefault(0);
        //???
       //await controller.clickElement(1, By.xpath('/html/body/div[7]/div/section/div/section/div/div/div/div/div[2]/div/div/div/div[1]/div/div/div/div/a'), 0);
        //lauch new window
        await controller.goTo(2, 'https://www.google.com/search?q=elephant&source=lnms&tbm=nws&sa=X&ved=0ahUKEwil5JaE7dflAhWwBKYKHRABCqYQ_AUIEigC&biw=1064&bih=1829');
        await controller.setBrowserRect(2, {x:1080, y:960, width:800, height:600});
        //???
        //let url_world_elephant = await controller.getGoogleSearchResultUrl(2, 1);
        //await controller.goTo(2, url_world_elephant);
        //lauch new window
        await controller.goTo(3, 'https://news.google.com/search?q=elephant&hl=en-SG&gl=SG&ceid=SG%3Aen');
        await controller.setBrowserRect(3, {x: 200, y:200, width:800, height:600});
        //???
        //let url_asia_elephant = await controller.getGoogleSearchResultUrl(3, 1);
        //await controller.goTo(3, url_asia_elephant);
        //wait and close all windows
        await delay(3000);
        await controller.closeBrowser(2);
        await delay(3000);
        await controller.closeBrowser(1);
        await delay(3000);
        await controller.closeBrowser(3);
        await delay(3000);
        await controller.closeBrowser(0);
        await delay(1000);
        await stateChange(1);
        console.log(ctrl_state.stat);
      })();
    }else if(currentTime = 1){

      //start to do main things
    }
  }
  previousTime = currentTime;
  if(ctrl_state.stat == 0){
    event.reply('ctrl', 'pause')
  }else if(ctrl_state.stat == 1){
    event.reply('ctrl', 'play');
  }
});


function stateChange(arg){
  Object.defineProperty(ctrl_state, 'stat', {
    value: arg,
    writable: true
  });
}

stateChange(0);
// delay
const delay = (interval) => {
  return new Promise((resolve) => {
    setTimeout(resolve, interval)
  });
}

/* (async () => {
  return; // comment this line to test
  console.log('start test');

  await controller.openBrowser(0);
  await controller.setBrowserRect(0, { x: 0, y: 0, width: 1080, height: 800 });
  await controller.goTo(0, 'https://www.bbc.com/');
  controller.SCROLL_GAP = 100;
  controller.SCROLL_INTERVAL = 50;
  await controller.scrollTo(0, 7680);
  await controller.scrollAndClickElement(0, By.xpath('/html/body/div[7]/div/section[9]/div/div/div[1]/div[2]/a'));
  await controller.switchToFrame(0, By.id('smphtml5iframeplayer'));
  await delay(1000);
  await controller.clickElement(0, By.id('mediaContainer'), 0);
  await controller.switchToDefault(0);

  console.log('end test');
})();
 */