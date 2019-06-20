const stopwatch = require('../../../../methods/stopwatch')

module.exports = () => {
  return {
    label: 'Stopwatch',
    submenu: [
      { id: 'start', label: 'Start', click: stopwatch.start },
      { id: 'pause', label: 'Pause / Continue', click: stopwatch.pause },
      { id: 'stop', label: 'Stop', click: stopwatch.stop },
    ]
  }
}