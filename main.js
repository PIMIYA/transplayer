const { app, BrowserWindow, ipcMain } = require('electron')
const net = require('net')
const Controller = require('./controller');

let HOST = 'localhost'
let PORT = 9999
let win
let currrentTime

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
  })



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
app.on('ready', createWindow)

//enable hardware acceleration
app.disableHardwareAcceleration()

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    // client.end();
    app.quit()
  }
})



app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})


let previousTime;

// ipcMain.on('timecode', (event, arg) => {
//   currentTime = Math.trunc(arg);
//   if (currentTime != previousTime) {
//     console.log('currentTime in secs: ' + currentTime)
//     if (currentTime == 1) {
//       console.log('open browser')
//       client.write(JSON.stringify({ "id": '0', "type": 100, "args": { "x": 0, "y": 0 } }));
//     }
//     if (currentTime == 3) {
//       console.log('load url')
//       client.write(JSON.stringify({ "id": '0', "type": 101, "args": { url: "http://google.com" } }));
//     }
//     if (currentTime == 5) {
//       console.log('resize window')
//       client.write(JSON.stringify({ "id": '0', "type": 105, "args": { target_width: 1080, target_height: 1920, move_duration: float = 0.3, drag_duration: float = 0.3 } }));
//     }


//   }
//   previousTime = currentTime
// });


// var client = net.connect(PORT, HOST, () => {
//   console.log('conneting to server');
// });

(async () => {
  let controller = new Controller();
  await controller.run();
})();
