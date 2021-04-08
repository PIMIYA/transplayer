const OSC = require("osc-js");

const osc = new OSC({
  plugin: new OSC.WebsocketServerPlugin(),
});
osc.open({
  host: "localhost", // @param {string} Hostname of WebSocket server
  port: 8080, // @param {number} Port of WebSocket server
}); // start server on port 8080

let previousTime;

osc.on("/test/random", (message) => {
  //console.log(parseInt(message.args)); // prints the message arguments
  let currentTime = parseInt(message.args);
  if (currentTime != previousTime) {
    previousTime = currentTime;
    console.log("current time in sec: ", currentTime);
    webProcess.send({
      currentTime: currentTime,
    });
  }
});

const child_process = require("child_process");

//let webProcess = child_process.fork("./web-process.js");
let webProcess = child_process.fork("./web-process-new.js");

if (process.platform === "win32") {
  var rl = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.on("SIGINT", function () {
    process.emit("SIGINT");
  });
}

process.on("SIGINT", function () {
  // graceful shutdown
  isCancelRequired = true;
  if (webProcess) {
    webProcess.kill();
  }
  osc.close();
  console.log("shutdown...");
  process.exit();
});
