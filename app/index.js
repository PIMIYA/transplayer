const videoElement = document.getElementById("vid");
const {
  ipcRenderer
} = require('electron')

videoElement.addEventListener('timeupdate', (event) => {
  var currentTime = videoElement.currentTime;
  //console.log(currentTime);
  ipcRenderer.send('timecode', currentTime);
});