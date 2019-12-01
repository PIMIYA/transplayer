const {
  app,
  BrowserWindow,
  ipcMain
} = require('electron');
const Controller = require('./controller');
const {
  By
} = require('selenium-webdriver');
const ex = require('child_process');

require('events').EventEmitter.prototype._maxListeners = 0;

let controller = new Controller();
let win
let previousTime
let display_width
let display_height

// delay
const delay = (interval) => {
  return new Promise((resolve) => {
    setTimeout(resolve, interval)
  });
}

// function bang(index) {
//   ex.exec(`node ./bang.js ${index}`);
// }

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
  win.setIgnoreMouseEvents(false)

  // and load the index.html of the app.
  win.loadFile('app/index.html')

  // Open the DevTools.
  //win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', async () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    await controller.closeAllBrowser();
    win = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
//app.on('ready', createWindow);
app.on('ready', () => {
  const electron = require('electron');
  const allDisplay = electron.screen.getAllDisplays();
  //console.log(allDisplay[0].bounds.width);
  if (allDisplay.length == 1) {
    console.log('1 display')
    display_width = allDisplay[0].bounds.width;
    display_height = allDisplay[0].bounds.height;
  }
  // if (allDisplay.length == 2) {
  //   console.log('2 displays')
  //   display_width = allDisplay[0].bounds.height + allDisplay[1].bounds.height;
  //   display_height = allDisplay[0].bounds.width;
  // }
  console.log('display_w:', display_width, 'display_h', display_height);

  createWindow();
})

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


let page_flag = 0;
let task = {
  10: {
    action: async () => {
      await controller.goTo(2, 'https://www.google.com/search?q=elephant&source=lnms&tbm=nws&sa=X&ved=0ahUKEwil5JaE7dflAhWwBKYKHRABCqYQ_AUIEigC&biw=1064&bih=1829');
      await controller.focusBrowser(1);
      await controller.focusBrowser(2);
      let url_elephant_w = await controller.getGoogleNewsSearchResultUrl(2, 0);
      controller.goTo(2, url_elephant_w);
      // await controller.setBrowserRect(2, {
      //   x: display_width * 0.6,
      //   y: display_height * 0.2,
      //   width: display_width * 0.4,
      //   height: display_height * 0.5
      // })
      // await delay(500);
      await controller.goTo(3, 'https://www.google.com/search?q=elephant&source=lnms&tbm=nws&sa=X&ved=0ahUKEwil5JaE7dflAhWwBKYKHRABCqYQ_AUIEigC&biw=1064&bih=1829');
      // await controller.focusBrowser(2);
      // await controller.focusBrowser(3);
      let url_elephant_a = await controller.getGoogleNewsSearchResultUrl(3, 2);
      await delay(500);
      controller.goTo(3, url_elephant_a);
      // await controller.setBrowserRect(3, {
      //   x: display_width * 0.2,
      //   y: display_height * 0.7,
      //   width: display_width * 0.4,
      //   height: display_height * 0.5
      // })
    }
  },
  65: {
    action: async () => {
      await controller.closeBrowser(3);
      await controller.closeBrowser(2);
      await controller.breakScroll(4);
      await controller.goTo(4, 'https://www.google.com/search?biw=1440&bih=798&tbm=isch&sxsrf=ACYBGNT_rUSmalUS6R34zPF8dOP-8X2iGw%3A1572500280528&sa=1&ei=OHO6Xc_rH-S2mAWoobRQ&q=map+of+melaka+fort&oq=map+of+melaka+fort&gs_l=img.3...2682.4688..4911...0.0..0.75.359.7......0....1..gws-wiz-img.wi4Ueu-el5k&ved=0ahUKEwjP54SF5MXlAhVkG6YKHagQDQoQ4dUDCAc&uact=5#imgrc=_');
      await controller.setBrowserRect(4, {
        x: -7,
        y: 0,
        width: display_width + 14,
        height: display_height + 7
      })
      await controller.focusBrowser(4);

      controller.SCROLL_GAP = 1;
      controller.SCROLL_INTERVAL = 10;
      controller.scrollTo(4, 3000);
    }
  },
  120: {
    action: async () => {
      await controller.goTo(4, 'https://www.google.com/search?biw=1440&bih=798&tbm=isch&sxsrf=ACYBGNQQsBvgZwqToOA7UAOcJN-8iSQVdw%3A1572495124539&sa=1&ei=FF-6XdexIJPpmAWzxIT4Ag&q=Telecom+tower&oq=Telecom+tower&gs_l=img.3..0i19l10.40579.40579..40997...0.0..0.47.47.1......0....2j1..gws-wiz-img.dr-TaZ-ge80&ved=0ahUKEwjXi7zq0MXlAhWTNKYKHTMiAS8Q4dUDCAc&uact=5');
      controller.scrollTo(4, 3000);
    }
  },
  122: {
    action: async () => {
      await controller.breakScroll(4);
      await controller.goTo(5, 'https://www.google.com/search?client=firefox-b-d&biw=1082&bih=884&tbm=vid&ei=ITnEXcGXHaSUmAXZmJCoBg&q=telecom+tower&oq=telecom+tower&gs_l=psy-ab.3..0i19k1l10.2108.5144.0.5281.13.11.0.2.2.0.64.569.11.11.0....0...1c.1.64.psy-ab..0.13.578...0j0i131k1j0i3k1j0i10k1j0i30k1j0i10i19k1.0.BJHO7TxPpVw');
      await controller.focusBrowser(4);
      await controller.focusBrowser(5);

      let url_tower = await controller.getGoogleVideoSearchResultUrl(5, 0);
      controller.goTo(5, url_tower + '&wide=1');

      controller.scrollTo(4, 3000);
    }
  },
  230: {
    action: async () => {
      await controller.breakScroll(4);
      await controller.goTo(4, 'https://www.google.com/search?q=pawang&sxsrf=ACYBGNSJ5y1GyTyDLeNGuObzD3qF48m3BQ:1572502741554&source=lnms&tbm=isch&sa=X&ved=0ahUKEwiO8MWa7cXlAhUSyIsBHWepAsMQ_AUIEigB&biw=1440&bih=798#imgrc=_');
      controller.scrollTo(4, 3000);
      await controller.closeBrowser(5);
    }
  },
  280: {
    action: async () => {
      await controller.breakScroll(4);
      await controller.goTo(4, 'https://www.google.com/search?biw=1440&bih=798&tbm=isch&sxsrf=ACYBGNRTTuCKjScRQgUZ4o6dyeqyGTGiPQ%3A1572502440570&sa=1&ei=qHu6XeW0IsqXr7wPoqWP8A8&q=Elephant+in+Keddah+or+Corral+painting&oq=Elephant+in+Keddah+or+Corral+painting&gs_l=img.3...12020.14881..15049...0.0..0.71.466.9......0....1..gws-wiz-img.3cGEqTlU0qw&ved=0ahUKEwjlqIOL7MXlAhXKy4sBHaLSA_4Q4dUDCAc&uact=5')
      controller.scrollTo(4, 3000);
    }
  },
  320: {
    action: async () => {
      await controller.breakScroll(4);
      await controller.goTo(4, 'https://www.google.com/search?q=elephant+violent&sxsrf=ACYBGNT0ATjLqewVNHwCw8SUMYSK9txqZw:1572503984349&source=lnms&tbm=isch&sa=X&ved=0ahUKEwiaiJTr8cXlAhUUJqYKHXNaBiMQ_AUIEigB&cshid=1572504257743713&biw=1440&bih=798&dpr=2');
      controller.scrollTo(4, 3000);
    }
  },
  340: {
    action: async () => {
      await controller.breakScroll(4);
      // //switch to google search
      // await controller.goTo(6, 'https://www.google.com/search?q=elephant+violent&source=lnms&tbm=vid&sa=X&ved=2ahUKEwi47qSLjZXmAhXWxosBHRcLAfMQ_AUoAnoECAsQBA&biw=1064&bih=863');
      // await controller.focusBrowser(4);
      // await controller.focusBrowser(6);

      // let url_el_violent = await controller.getGoogleVideoSearchResultUrl(6, 0);
      // controller.goTo(6, url_el_violent + '&wide=1');
      // //switch to google search
      // await controller.goTo(7, 'https://www.google.com/search?q=elephant+violent&source=lnms&tbm=vid&sa=X&ved=2ahUKEwi47qSLjZXmAhXWxosBHRcLAfMQ_AUoAnoECAsQBA&biw=1064&bih=863');
      // await controller.focusBrowser(6);
      // await controller.focusBrowser(7);

      // let url_el_violent_y = await controller.getGoogleVideoSearchResultUrl(7, 2);
      // controller.goTo(7, url_el_violent_y + '&wide=1');

      //switch to youtube search
      await controller.goTo(6, 'https://www.youtube.com/results?search_query=elephant+violent&sp=CAMSAhAB');
      await controller.focusBrowser(4);
      await controller.focusBrowser(6);

      let url_el_violent = await controller.getLinkUrl(6, By.id('video-title'), 0);
      controller.goTo(6, url_el_violent + '&wide=1');
    }
  },
  345: {
    action: async () => {
      //switch to youtube search
      await controller.goTo(7, 'https://www.youtube.com/results?search_query=elephant+violent&sp=CAMSBAgFEAE%253D');
      await controller.focusBrowser(6);
      await controller.focusBrowser(7);

      let url_el_violent_y = await controller.getLinkUrl(7, By.id('video-title'), 2);
      controller.goTo(7, url_el_violent_y + '&wide=1');
    }
  },
  400: {
    action: async () => {
      await controller.goTo(4, 'https://www.google.com/search?biw=1440&bih=798&tbm=isch&sxsrf=ACYBGNRQ-iRUKfes8t7OW9tPyCdLPSycWg%3A1572504312313&sa=1&ei=-IK6XfXgEpW7wAOB6Y6QBA&q=elephant+bone&oq=elephant+bone&gs_l=img.3..0j0i30l3j0i8i30l4j0i5i30l2.47591.56597..57257...3.0..0.63.761.16......0....1..gws-wiz-img.....10..0i24j35i362i39j35i39j0i19j0i10i19.s3pUpO-Qsnc&ved=0ahUKEwj1vMWH88XlAhWVHXAKHYG0A0IQ4dUDCAc&uact=5');
      controller.scrollTo(4, 7000);
    }
  },
  420: {
    action: async () => {
      await controller.closeBrowser(6);
      await controller.closeBrowser(7);
    }
  },
  450: {
    action: async () => {
      await controller.breakScroll(4);
      await controller.goTo(4, 'https://www.google.com/search?q=History+and+Ethnography+Museum&sxsrf=ACYBGNQP5pBdzmb24hL-nwVLtFIrc2FYEQ:1572504658222&source=lnms&tbm=isch&sa=X&ved=0ahUKEwjO972s9MXlAhW1yosBHWrLDWgQ_AUIEygC&biw=1440&bih=798');
      controller.scrollTo(4, 3000);

      await controller.breakScroll(4);
      await controller.goTo(10, 'https://www.youtube.com/results?search_query=History+and+Ethnography+Museum+melaka&sp=CAM%253D');
      await controller.focusBrowser(4);
      await controller.focusBrowser(10);

      let url_hae = await controller.getLinkUrl(10, By.id('video-title'), 0);
      controller.goTo(10, url_hae + '&wide=1');

      controller.scrollTo(4, 3000);
    }
  },
  530: {
    action: async () => {
      await controller.breakScroll(4);
      await controller.goTo(4, 'https://www.google.com/search?biw=1440&bih=798&tbm=isch&sxsrf=ACYBGNQTmrNFatqqcWpUKdaoqrKdNB1KGA%3A1572504950513&sa=1&ei=doW6XcTzHoSFr7wPt9etqAk&q=history+gunpowder&oq=history+gunpowder&gs_l=img.3..0i19.29455.31762..32066...0.0..0.49.349.8......0....1..gws-wiz-img.......0i7i30j0i8i7i30.9XnTVluR7ZQ&ved=0ahUKEwjEhu639cXlAhWEwosBHbdrC5UQ4dUDCAc&uact=5#imgrc=_');
      controller.scrollTo(4, 3000);
      await controller.closeBrowser(10);
    }
  },
  580: {
    action: async () => {
      await controller.breakScroll(4);
      await controller.goTo(12, 'https://www.youtube.com/results?search_query=best+GUNPOWDER+EXPLOSION&sp=CAM%253D');
      await controller.focusBrowser(4);
      await controller.focusBrowser(12);

      let url_powder_r = await controller.getLinkUrl(12, By.id('video-title'), 0);
      controller.goTo(12, url_powder_r + '&t=3m0s&wide=1');

      await controller.goTo(11, 'https://www.youtube.com/results?search_query=best+GUNPOWDER+EXPLOSION&sp=CAM%253D');
      await controller.focusBrowser(12);
      await controller.focusBrowser(11);

      let url_powder_l = await controller.getLinkUrl(11, By.id('video-title'), 0);
      controller.goTo(11, url_powder_l + '&wide=1');

      controller.scrollTo(4, 3000);
    }
  },
  778: {
    action: async () => {
      await controller.closeBrowser(11);
    }
  },
  779: {
    action: async () => {
      await controller.closeBrowser(12);
    }
  },
  770: {
    action: async () => {
      await controller.closeBrowser(4);

      if (page_flag == 0) {
        page_flag = 1;
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
      }

      //close bg later
      controller.SCROLL_GAP = 50;
      controller.SCROLL_INTERVAL = 50;
      await controller.scrollAndClickElement(0, By.xpath('/html/body/div[7]/div/section[9]/div/div/div[1]/div[2]/a'));
      await controller.switchToFrame(0, By.id('smphtml5iframeplayer'));
      await delay(500);
      await controller.clickElement(0, By.id('mediaContainer'), 0);
      await controller.switchToDefault(0);
    },
    771: {
      action: async () => {
        await controller.clickElement(0, By.id('mediaContainer'), 0);
        await controller.switchToDefault(0);
      }
    }
  }
};