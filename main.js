const { app, BrowserWindow, ipcMain } = require('electron')
const Controller = require('./controller');

let win

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

// TODO: TEST
(async () => {
  let controller = new Controller();
  // await this.goTo(0, 'https://www.google.com.tw/search?tbm=isch&hl=en&q=meerkat');
  await controller.goTo(0, 'https://www.google.com/search?q=meerkat');
  let url = await controller.getGoogleSearchResultUrl(0, 0);
  console.log(`${url}`);
  url = await controller.getGoogleSearchResultUrl(0, 1);
  console.log(`${url}`);
  url = await controller.getGoogleSearchResultUrl(0, 2);
  console.log(`${url}`);
  console.log(`done`);
})();
