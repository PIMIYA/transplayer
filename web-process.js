const { By } = require("selenium-webdriver");

const Controller = require("./controller");

const delay = (interval) => {
  return new Promise((resolve) => {
    setTimeout(resolve, interval);
  });
};
require("events").EventEmitter.defaultMaxListeners = 100;
//require("events").EventEmitter.prototype._maxListeners = 100;

let controller = new Controller();

let display_width = 2160;
let display_height = 1920;
let page_flag = 0;

//remove all focus function for linux platform
let task = {
  10: {
    action: async () => {
      await controller.goTo(
        2,
        "https://www.google.com/search?q=elephant&source=lnms&tbm=nws&sa=X&ved=0ahUKEwil5JaE7dflAhWwBKYKHRABCqYQ_AUIEigC&biw=1064&bih=1829"
      );

      let url_elephant_w = await controller.getGoogleNewsSearchResultUrl(2, 0);
      await controller.goTo(2, url_elephant_w);
      await delay(500);

      await controller.goTo(
        3,
        "https://www.google.com/search?q=elephant&source=lnms&tbm=nws&sa=X&ved=0ahUKEwil5JaE7dflAhWwBKYKHRABCqYQ_AUIEigC&biw=1064&bih=1829"
      );
      let url_elephant_a = await controller.getGoogleNewsSearchResultUrl(3, 2);
      await delay(500);
      controller.goTo(3, url_elephant_a);
    },
  },
  65: {
    action: async () => {
      await controller.closeBrowser(3);
      await controller.closeBrowser(2);
      await controller.goTo(
        4,
        "https://www.google.com/search?biw=1440&bih=798&tbm=isch&sxsrf=ACYBGNT_rUSmalUS6R34zPF8dOP-8X2iGw%3A1572500280528&sa=1&ei=OHO6Xc_rH-S2mAWoobRQ&q=map+of+melaka+fort&oq=map+of+melaka+fort&gs_l=img.3...2682.4688..4911...0.0..0.75.359.7......0....1..gws-wiz-img.wi4Ueu-el5k&ved=0ahUKEwjP54SF5MXlAhVkG6YKHagQDQoQ4dUDCAc&uact=5#imgrc=_"
      );
      await controller.setBrowserRect(4, {
        x: 0,
        y: 0,
        width: display_width,
        height: display_height,
      });
      controller.SCROLL_GAP = 1;
      controller.SCROLL_INTERVAL = 10;
      controller.scrollTo(4, 3000);
    },
  },
  120: {
    action: async () => {
      await controller.goTo(
        4,
        "https://www.google.com/search?biw=1440&bih=798&tbm=isch&sxsrf=ACYBGNQQsBvgZwqToOA7UAOcJN-8iSQVdw%3A1572495124539&sa=1&ei=FF-6XdexIJPpmAWzxIT4Ag&q=Telecom+tower&oq=Telecom+tower&gs_l=img.3..0i19l10.40579.40579..40997...0.0..0.47.47.1......0....2j1..gws-wiz-img.dr-TaZ-ge80&ved=0ahUKEwjXi7zq0MXlAhWTNKYKHTMiAS8Q4dUDCAc&uact=5"
      );
      controller.scrollTo(4, 3000);
    },
  },
  122: {
    action: async () => {
      await controller.breakScroll(4);
      await controller.goTo(
        5,
        "https://www.google.com/search?client=firefox-b-d&biw=1082&bih=884&tbm=vid&ei=ITnEXcGXHaSUmAXZmJCoBg&q=telecom+tower&oq=telecom+tower&gs_l=psy-ab.3..0i19k1l10.2108.5144.0.5281.13.11.0.2.2.0.64.569.11.11.0....0...1c.1.64.psy-ab..0.13.578...0j0i131k1j0i3k1j0i10k1j0i30k1j0i10i19k1.0.BJHO7TxPpVw"
      );

      let url_tower = "https://www.youtube.com/watch?v=lPjzsGF5opY";

      await controller.goTo(5, url_tower + "&wide=1");
      await delay(500);
      await controller.playYoutubeVideo(5);

      controller.scrollTo(4, 3000);
    },
  },
  230: {
    action: async () => {
      await controller.breakScroll(4);
      await controller.goTo(
        4,
        "https://www.google.com/search?q=pawang&sxsrf=ACYBGNSJ5y1GyTyDLeNGuObzD3qF48m3BQ:1572502741554&source=lnms&tbm=isch&sa=X&ved=0ahUKEwiO8MWa7cXlAhUSyIsBHWepAsMQ_AUIEigB&biw=1440&bih=798#imgrc=_"
      );
      controller.scrollTo(4, 3000);
      await controller.closeBrowser(5);
    },
  },
  280: {
    action: async () => {
      await controller.breakScroll(4);
      await controller.goTo(
        4,
        "https://www.google.com/search?biw=1440&bih=798&tbm=isch&sxsrf=ACYBGNRTTuCKjScRQgUZ4o6dyeqyGTGiPQ%3A1572502440570&sa=1&ei=qHu6XeW0IsqXr7wPoqWP8A8&q=Elephant+in+Keddah+or+Corral+painting&oq=Elephant+in+Keddah+or+Corral+painting&gs_l=img.3...12020.14881..15049...0.0..0.71.466.9......0....1..gws-wiz-img.3cGEqTlU0qw&ved=0ahUKEwjlqIOL7MXlAhXKy4sBHaLSA_4Q4dUDCAc&uact=5"
      );
      controller.scrollTo(4, 3000);
    },
  },
  320: {
    action: async () => {
      await controller.breakScroll(4);
      await controller.goTo(
        4,
        "https://www.google.com/search?q=elephant+violent&sxsrf=ACYBGNT0ATjLqewVNHwCw8SUMYSK9txqZw:1572503984349&source=lnms&tbm=isch&sa=X&ved=0ahUKEwiaiJTr8cXlAhUUJqYKHXNaBiMQ_AUIEigB&cshid=1572504257743713&biw=1440&bih=798&dpr=2"
      );
      controller.scrollTo(4, 3000);
    },
  },
  325: {
    action: async () => {
      await controller.breakScroll(4);

      await controller.goTo(
        6,
        "https://www.youtube.com/results?search_query=elephant+violent&sp=CAMSAhAB"
      );

      let url_el_violent = await controller.getLinkUrl(
        6,
        By.id("video-title"),
        0
      );
      await controller.goTo(6, url_el_violent + "&wide=1");
      await delay(500);
      await controller.playYoutubeVideo(6);
    },
  },
  335: {
    action: async () => {
      //switch to youtube search
      await controller.goTo(
        7,
        "https://www.youtube.com/results?search_query=elephant+violent&sp=CAMSAhAB"
      );

      let url_el_violent_y = await controller.getLinkUrl(
        7,
        By.id("video-title"),
        2
      );
      await controller.goTo(7, url_el_violent_y + "&wide=1");
      await delay(500);
      await controller.playYoutubeVideo(7);
    },
  },
  400: {
    action: async () => {
      await controller.goTo(
        4,
        "https://www.google.com/search?biw=1440&bih=798&tbm=isch&sxsrf=ACYBGNRQ-iRUKfes8t7OW9tPyCdLPSycWg%3A1572504312313&sa=1&ei=-IK6XfXgEpW7wAOB6Y6QBA&q=elephant+bone&oq=elephant+bone&gs_l=img.3..0j0i30l3j0i8i30l4j0i5i30l2.47591.56597..57257...3.0..0.63.761.16......0....1..gws-wiz-img.....10..0i24j35i362i39j35i39j0i19j0i10i19.s3pUpO-Qsnc&ved=0ahUKEwj1vMWH88XlAhWVHXAKHYG0A0IQ4dUDCAc&uact=5"
      );
      controller.scrollTo(4, 7000);
    },
  },
  420: {
    action: async () => {},
  },
  450: {
    action: async () => {
      await controller.breakScroll(4);
      await controller.goTo(
        4,
        "https://www.google.com/search?q=History+and+Ethnography+Museum&sxsrf=ACYBGNQP5pBdzmb24hL-nwVLtFIrc2FYEQ:1572504658222&source=lnms&tbm=isch&sa=X&ved=0ahUKEwjO972s9MXlAhW1yosBHWrLDWgQ_AUIEygC&biw=1440&bih=798"
      );
      controller.scrollTo(4, 3000);

      await controller.breakScroll(4);

      await controller.closeBrowser(6);
      await controller.closeBrowser(7);

      let url_hae = "https://www.youtube.com/watch?v=dDWaSN_lMPU";
      await controller.goTo(10, url_hae + "&wide=1");
      await delay(500);
      await controller.playYoutubeVideo(10);

      controller.scrollTo(4, 3000);
    },
  },
  530: {
    action: async () => {
      await controller.breakScroll(4);
      await controller.goTo(
        4,
        "https://www.google.com/search?biw=1440&bih=798&tbm=isch&sxsrf=ACYBGNQTmrNFatqqcWpUKdaoqrKdNB1KGA%3A1572504950513&sa=1&ei=doW6XcTzHoSFr7wPt9etqAk&q=history+gunpowder&oq=history+gunpowder&gs_l=img.3..0i19.29455.31762..32066...0.0..0.49.349.8......0....1..gws-wiz-img.......0i7i30j0i8i7i30.9XnTVluR7ZQ&ved=0ahUKEwjEhu639cXlAhWEwosBHbdrC5UQ4dUDCAc&uact=5#imgrc=_"
      );
      controller.scrollTo(4, 3000);
      await controller.closeBrowser(10);
    },
  },
  580: {
    action: async () => {
      await controller.breakScroll(4);
      await controller.goTo(
        12,
        "https://www.youtube.com/results?search_query=best+GUNPOWDER+EXPLOSION&sp=CAM%253D"
      );

      let url_powder_r = await controller.getLinkUrl(
        12,
        By.id("video-title"),
        0
      );
      await controller.goTo(12, url_powder_r + "&t=3m0s" + "&wide=1");
      await delay(500);
      await controller.playYoutubeVideo(12);

      await controller.goTo(
        11,
        "https://www.youtube.com/results?search_query=best+GUNPOWDER+EXPLOSION&sp=CAM%253D"
      );

      let url_powder_l = await controller.getLinkUrl(
        11,
        By.id("video-title"),
        0
      );
      await controller.goTo(11, url_powder_l + "&wide=1");
      await delay(500);
      await controller.playYoutubeVideo(11);

      controller.scrollTo(4, 3000);
    },
  },
  778: {
    action: async () => {
      await controller.closeBrowser(11);
    },
  },
  779: {
    action: async () => {
      await controller.closeBrowser(12);
    },
  },
  770: {
    action: async () => {
      await controller.closeBrowser(4);

      if (page_flag == 0) {
        page_flag = 1;
        await controller.goTo(0, "https://www.bbc.com/");
        await controller.goTo(1, "https://www.straitstimes.com/singapore");
        await controller.setBrowserRect(0, {
          x: 0,
          y: 0,
          width: display_width / 2,
          height: display_height,
        });
        await controller.setBrowserRect(1, {
          x: display_width / 2,
          y: 0,
          width: display_width / 2,
          height: display_height,
        });
      } else {
        await controller.refresh(0);
      }

      //close bg later
      controller.SCROLL_GAP = 50;
      controller.SCROLL_INTERVAL = 50;
      try {
        await controller.scrollAndClickElementByXPath(
          0,
          "/html/body/div[7]/div/section[10]/div/div/div[1]/div[2]/a"
        );
        await controller.switchToFrame(0, By.id("smphtml5iframeplayer"));
        await delay(500);
        await controller.clickElement(0, By.id("mediaContainer"), 0);
        await controller.switchToDefault(0);
      } catch (error) {}
    },
  },
};

async function callTask(t) {
  if (!task[t]) {
    return;
  }
  task[t].action();
}

process.on("message", function (args) {
  console.log(args);
  let currentTime = args["currentTime"];
  (async () => callTask(currentTime))();
});
