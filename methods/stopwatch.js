
function start(menuItem, window) {
  window.webContents.send('stopwatch-start')
}

function pause(menuItem, window) {
  window.webContents.send('stopwatch-pause')
}

function stop(menuItem, window) {
  window.webContents.send('stopwatch-stop')
}

module.exports.start = start
module.exports.pause = pause
module.exports.stop = stop