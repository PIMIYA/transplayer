const {
  app,
  BrowserWindow,
  ipcMain
} = require('electron')
const Controller = require('./controller');
const {
  By
} = require('selenium-webdriver');

let controller = new Controller();
let win
let previousTime

// delay
const delay = (interval) => {
  return new Promise((resolve) => {
    setTimeout(resolve, interval)
  });
}

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

ipcMain.on('timecode', (event, arg) => {
  // return;
  currentTime = Math.trunc(arg)

  if (currentTime != previousTime) {
    previousTime = currentTime;
    console.log('current time in sec: ', currentTime);
    if (!task[currentTime]) {
      return;
    }
    task[currentTime].action();
  }
});

let task = {
  0: {
    action: async () => {
      //set up two news pages
      await controller.openBrowser(0);
      controller.goTo(0, 'https://www.bbc.com/');
      // controller.setBrowserRect(0, {
      //   x: 0,
      //   y: 0,
      //   width: 1080,
      //   height: 1920
      // });
      await controller.openBrowser(1);
      controller.goTo(1, 'https://www.straitstimes.com/global');
      // await controller.setBrowserRect(1, {
      //   x: 1080,
      //   y: 0,
      //   width: 1080,
      //   height: 1920
      // });


      controller.SCROLL_GAP = 50;
      controller.SCROLL_INTERVAL = 10;
      await controller.goTo(1, 'https://www.straitstimes.com/singapore');
      await controller.scrollTo(0, 7758);
      await controller.scrollAndClickElement(0, By.xpath('/html/body/div[7]/div/section[9]/div/div/div[1]/div[2]/a'));
      await controller.switchToFrame(0, By.id('smphtml5iframeplayer'));
      await delay(500);
      await controller.clickElement(0, By.id('mediaContainer'), 0);
      await controller.switchToDefault(0);
      //await delay(1000);
      //???
      await controller.clickElement(1, By.xpath('/html/body/div[7]/div/section/div/section/div/div/div/div/div[2]/div/div/div/div[1]/div/div/div/div/a'), 0);
      //lauch new window
      await controller.goTo(2, 'https://www.google.com/search?q=elephant&source=lnms&tbm=nws&sa=X&ved=0ahUKEwil5JaE7dflAhWwBKYKHRABCqYQ_AUIEigC&biw=1064&bih=1829');
      // await controller.setBrowserRect(2, {
      //   x: 1080,
      //   y: 960,
      //   width: 1280,
      //   height: 768
      // });
      controller.SCROLL_GAP = 100;
      controller.SCROLL_INTERVAL = 50;
      //???
      let url_elephant_w = await controller.getGoogleNewsSearchResultUrl(2, 0);
      await controller.goTo(2, url_elephant_w);
      await controller.scrollTo(2, 200);
      //lauch new window
      await controller.goTo(3, 'https://www.google.com/search?q=elephant&source=lnms&tbm=nws&sa=X&ved=0ahUKEwil5JaE7dflAhWwBKYKHRABCqYQ_AUIEigC&biw=1064&bih=1829');
      // await controller.setBrowserRect(3, {
      //   x: 200,
      //   y: 200,
      //   width: 1280,
      //   height: 768
      // });
      //???
      let url_elephant_a = await controller.getGoogleNewsSearchResultUrl(3, 0);
      await controller.goTo(3, url_elephant_a);
      await controller.scrollTo(3, 200);
      //wait and close all windows
      //await delay(1000);
      await controller.closeBrowser(2);
      //await delay(1000);
      await controller.closeBrowser(1);
      //await delay(1000);
      await controller.closeBrowser(3);
      //await delay(1000);
      await controller.closeBrowser(0);
      //await delay(1000);
    }
  },
  60: {
    action: async () => {
      await controller.goTo(4, 'https://www.google.com/search?biw=1440&bih=798&tbm=isch&sxsrf=ACYBGNT_rUSmalUS6R34zPF8dOP-8X2iGw%3A1572500280528&sa=1&ei=OHO6Xc_rH-S2mAWoobRQ&q=map+of+melaka+fort&oq=map+of+melaka+fort&gs_l=img.3...2682.4688..4911...0.0..0.75.359.7......0....1..gws-wiz-img.wi4Ueu-el5k&ved=0ahUKEwjP54SF5MXlAhVkG6YKHagQDQoQ4dUDCAc&uact=5#imgrc=_');
      // await controller.setBrowserRect(4, {
      //   x: 0,
      //   y: 0,
      //   width: 2160,
      //   height: 1920
      // });
      //await controller.maximizeBrowser(4);
      controller.SCROLL_GAP = 1;
      controller.SCROLL_INTERVAL = 5;
      //await controller.scrollTo(4, 3000);
    }
  },
  120: {
    action: async () => {
      await controller.openBrowser(4);
      await controller.goTo(4, 'https://www.google.com/search?biw=1440&bih=798&tbm=isch&sxsrf=ACYBGNQQsBvgZwqToOA7UAOcJN-8iSQVdw%3A1572495124539&sa=1&ei=FF-6XdexIJPpmAWzxIT4Ag&q=Telecom+tower&oq=Telecom+tower&gs_l=img.3..0i19l10.40579.40579..40997...0.0..0.47.47.1......0....2j1..gws-wiz-img.dr-TaZ-ge80&ved=0ahUKEwjXi7zq0MXlAhWTNKYKHTMiAS8Q4dUDCAc&uact=5');
      //controller.scrollTo(4, 3000);
      await controller.openBrowser(5);
      await controller.goTo(5, 'https://www.google.com/search?client=firefox-b-d&biw=1082&bih=884&tbm=vid&ei=ITnEXcGXHaSUmAXZmJCoBg&q=telecom+tower&oq=telecom+tower&gs_l=psy-ab.3..0i19k1l10.2108.5144.0.5281.13.11.0.2.2.0.64.569.11.11.0....0...1c.1.64.psy-ab..0.13.578...0j0i131k1j0i3k1j0i10k1j0i30k1j0i10i19k1.0.BJHO7TxPpVw');
      // await controller.setBrowserRect(5, {
      //   x: 400,
      //   y: 300,
      //   width: 1024,
      //   height: 768
      // });
      await controller.clickElement(5, By.id('vidthumb1'), 0);
      //???
      controller.clickElement(5, By.xpath('/html/body/ytd-app/div/ytd-page-manager/ytd-watch-flexy/div[3]/div[1]/div/div[1]/div/div/div/ytd-player/div/div/div[4]/button'));
    }
  },
  180: {
    action: async () => {
      await controller.goTo(4, 'https://www.google.com/search?q=pawang&sxsrf=ACYBGNSJ5y1GyTyDLeNGuObzD3qF48m3BQ:1572502741554&source=lnms&tbm=isch&sa=X&ved=0ahUKEwiO8MWa7cXlAhUSyIsBHWepAsMQ_AUIEigB&biw=1440&bih=798#imgrc=_');
      //await controller.scrollTo(4, 500);
      await controller.closeBrowser(5);
    }
  },
  240: {
    action: async () => {
      await controller.goTo(4, 'https://www.google.com/search?biw=1440&bih=798&tbm=isch&sxsrf=ACYBGNRTTuCKjScRQgUZ4o6dyeqyGTGiPQ%3A1572502440570&sa=1&ei=qHu6XeW0IsqXr7wPoqWP8A8&q=Elephant+in+Keddah+or+Corral+painting&oq=Elephant+in+Keddah+or+Corral+painting&gs_l=img.3...12020.14881..15049...0.0..0.71.466.9......0....1..gws-wiz-img.3cGEqTlU0qw&ved=0ahUKEwjlqIOL7MXlAhXKy4sBHaLSA_4Q4dUDCAc&uact=5')
      await controller.scrollTo(4, 500);
    }
  },
  300: {
    action: async () => {
      await controller.goTo(4, 'https://www.google.com/search?q=elephant+violent&sxsrf=ACYBGNT0ATjLqewVNHwCw8SUMYSK9txqZw:1572503984349&source=lnms&tbm=isch&sa=X&ved=0ahUKEwiaiJTr8cXlAhUUJqYKHXNaBiMQ_AUIEigB&cshid=1572504257743713&biw=1440&bih=798&dpr=2');
      //await controller.scrollTo(4, 3000);
      await controller.goTo(6, 'https://www.youtube.com/results?search_query=elephant+violent&sp=CAMSAhAB');
      // await controller.setBrowserRect(5, {
      //   x: 300,
      //   y: 300,
      //   width: 1024,
      //   height: 768
      // });
      await controller.clickElement(6, By.id('video-title'), 0);
      await controller.goTo(7, 'https://www.youtube.com/results?search_query=elephant+violent&sp=CAMSAhAB');
      // await controller.setBrowserRect(7, {
      //   x: 1080,
      //   y: 300,
      //   width: 1024,
      //   height: 768
      // });
      await controller.clickElement(7, By.id('video-title'), 2);
    }
  },
  360: {
    action: async () => {
      await controller.goTo(4, 'https://www.google.com/search?q=elephant+violent&sxsrf=ACYBGNT0ATjLqewVNHwCw8SUMYSK9txqZw:1572503984349&source=lnms&tbm=isch&sa=X&ved=0ahUKEwiaiJTr8cXlAhUUJqYKHXNaBiMQ_AUIEigB&cshid=1572504257743713&biw=1440&bih=798&dpr=2');
      //await controller.scrollTo(4, 500);
      await controller.goTo(8, 'https://www.youtube.com/results?search_query=elephant+violent&sp=CAMSAhAB');
      // await controller.setBrowserRect(0, {
      //   x: 300,
      //   y: 300,
      //   width: 1024,
      //   height: 768
      // });
      await controller.clickElement(8, By.id('video-title'), 0);
      await controller.goTo(9, 'https://www.youtube.com/results?search_query=elephant+violent&sp=CAMSAhAB');
      // await controller.setBrowserRect(9, {
      //   x: 1080,
      //   y: 300,
      //   width: 1024,
      //   height: 768
      // });
      await controller.clickElement(9, By.id('video-title'), 2);
    }
  },
  420: {
    action: async () => {
      await controller.goTo(4, 'https://www.google.com/search?&biw=1440&bih=798&tbm=isch&sxsrf=ACYBGNRQ-iRUKfes8t7OW9tPyCdLPSycWg%3A1572504312313&sa=1&ei=-IK6XfXgEpW7wAOB6Y6QBA&q=elephant+bone&oq=elephant+bone&gs_l=img.3..0j0i30l3j0i8i30l4j0i5i30l2.47591.56597..57257...3.0..0.63.761.16......0....1..gws-wiz-img.....10..0i24j35i362i39j35i39j0i19j0i10i19.s3pUpO-Qsnc&ved=0ahUKEwj1vMWH88XlAhWVHXAKHYG0A0IQ4dUDCAc&uact=5');
      //await controller.scrollTo(4, 500);
      await controller.closeBrowser(8);
      await controller.closeBrowser(9);
    }
  },
  480: {
    action: async () => {
      await controller.goTo(4, 'https://www.google.com/search?q=History+and+Ethnography+Museum&sxsrf=ACYBGNQP5pBdzmb24hL-nwVLtFIrc2FYEQ:1572504658222&source=lnms&tbm=isch&sa=X&ved=0ahUKEwjO972s9MXlAhW1yosBHWrLDWgQ_AUIEygC&biw=1440&bih=798');
      //await controller.scrollTo(4, 500);
      await controller.goTo(10, 'https://www.youtube.com/results?search_query=History+and+Ethnography+Museum+melaka&sp=CAM%253D');
      // await controller.setBrowserRect(10, {
      //   x: 300,
      //   y: 300,
      //   width: 1024,
      //   height: 768
      // });
      await controller.clickElement(10, By.id('video-title'), 0);
    }
  },
  540: {
    action: async () => {
      await controller.goTo(4, 'https://www.google.com/search?biw=1440&bih=798&tbm=isch&sxsrf=ACYBGNQTmrNFatqqcWpUKdaoqrKdNB1KGA%3A1572504950513&sa=1&ei=doW6XcTzHoSFr7wPt9etqAk&q=history+gunpowder&oq=history+gunpowder&gs_l=img.3..0i19.29455.31762..32066...0.0..0.49.349.8......0....1..gws-wiz-img.......0i7i30j0i8i7i30.9XnTVluR7ZQ&ved=0ahUKEwjEhu639cXlAhWEwosBHbdrC5UQ4dUDCAc&uact=5#imgrc=_');
      //await controller.scrollTo(4, 500);
      await controller.closeBrowser(10);
    }
  },
  600: {
    action: async () => {
      await controller.goTo(11, 'https://www.youtube.com/results?search_query=best+GUNPOWDER+EXPLOSION&sp=CAM%253D');
      // await controller.setBrowserRect(11, {
      //   x: 300,
      //   y: 300,
      //   width: 1024,
      //   height: 768
      // });
      await controller.clickElement(11, By.id('video-title'), 0);
      await controller.goTo(12, 'https://www.youtube.com/results?search_query=best+GUNPOWDER+EXPLOSION&sp=CAM%253D');
      // await controller.setBrowserRect(12, {
      //   x: 1080,
      //   y: 300,
      //   width: 1024,
      //   height: 768
      // });
      await controller.clickElement(12, By.id('video-title'), 0);
    }
  },
  775: {
    action: async () => {
      await controller.closeBrowser(11);
      await delay(3000);
      await controller.closeBrowser(12);
      await delay(5000);
      await controller.closeBrowser(4);
    }
  }
};