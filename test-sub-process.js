const child_process = require("child_process");

//let webProcess = child_process.fork('./web-process.js');
let webProcess = child_process.fork("./web-process-new.js");

let isCancelRequired = false;

const delay = (interval) => {
  return new Promise((resolve) => {
    setTimeout(resolve, interval);
  });
};

// if (process.platform === "win32") {
//     var rl = require("readline").createInterface({
//         input: process.stdin,
//         output: process.stdout
//     });

//     rl.on("SIGINT", function () {
//         process.emit("SIGINT");
//     });
// }

// console.log(process.platform);

// process.on("SIGINT", function () {
//     // graceful shutdown
//     isCancelRequired = true;
//     if (webProcess) {
//         webProcess.kill();
//     }
//     console.log('shutdown...');
//     process.exit();
// });

let currentTime = 770;

(async () => {
  while (true) {
    if (isCancelRequired) {
      break;
    }

    if (webProcess.killed) {
      break;
    }

    webProcess.send({
      currentTime: currentTime,
    });

    await delay(1000);
    currentTime++;
    if (currentTime >= 781) {
      currentTime = 0;
    }
  }
})();
