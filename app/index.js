const videoElement = document.getElementById("vid");
/* 
const { GPU } = require('gpu.js');
const gpu = new GPU();
const kernel = gpu.createKernel(function (videoFrame) {
  const pixel = videoFrame[this.thread.y][this.thread.x];
  this.color(pixel[0], pixel[1], pixel[2], pixel[3]);
})
  .setGraphical(true)
  .setOutput([100, 100]);

kernel(videoElement); */

/* 
function render() {
  kernel(videoElement);
  window.requestAnimationFrame(render);
}

render(); */
const { ipcRenderer } = require('electron')

videoElement.addEventListener('timeupdate', (event) => {
  var currentTime = videoElement.currentTime;
  //console.log(currentTime);
  ipcRenderer.send('timecode', currentTime);
});

