const { app, BrowserWindow } = require("electron");
require("v8-compile-cache");
require("events").EventEmitter.prototype._maxListeners = 0;

let win;
let display_width;
let display_height;

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    webSecurity: false,
    x: 0,
    y: 0,
    width: 720,
    height: 640,
    focusable: false,
    transparent: true,
    frame: false,
    fullscreen: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    enableLargerThanScreen: false,
    webPreferences: {
      nodeIntegration: false,
      nodeIntegrationInWorker: true,
    },
  });

  win.setSize(2160, 1920);

  //add mouse press through
  win.setIgnoreMouseEvents(true);

  // and load the index.html of the app.
  win.loadFile("app/index.html");

  // Open the DevTools.
  //win.webContents.openDevTools();

  // Emitted when the window is closed.
  win.on("closed", async () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
}

app.commandLine.appendSwitch("autoplay-policy", "no-user-gesture-required");

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
//app.on('ready', createWindow);
app.on("ready", () => {
  const electron = require("electron");
  const allDisplay = electron.screen.getAllDisplays();
  //console.log(allDisplay[0].bounds.width);
  if (allDisplay.length == 1) {
    console.log("1 display");
    display_width = allDisplay[0].bounds.width;
    display_height = allDisplay[0].bounds.height;
  } else if (allDisplay.length == 2) {
    console.log("2 displays");
    display_width = allDisplay[0].bounds.height + allDisplay[1].bounds.height;
    display_height = allDisplay[0].bounds.width;
  }
  console.log("display_w:", display_width, "display_h", display_height);

  setTimeout(createWindow, 500);
  //createWindow();
});

//enable hardware acceleration
app.disableHardwareAcceleration(true);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    // client.end();
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});
