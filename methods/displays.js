const electron = require('electron')

function getFullscreenDisplays() {
  let displays = getDisplays()
  let fullscreenDisplays = []

  displays.forEach((display, index) => {
    ++index
    let id = `display${index}`
    let label = `Display${index} (${display.width}x${display.height})`
    let accelerator = `CommandOrControl+Shift+${index}`
    fullscreenDisplays.push({ id, label, accelerator, type: 'radio', ...display })
  })

  return fullscreenDisplays
}

function getWindowedDisplays() {
  let displays = getDisplays()
  let windowedDisplays = []

  displays.forEach((display, index) => {
    ++index
    let id = `display${index}`
    let label = `Display${index} (${display.width}x${display.height})`
    windowedDisplays.push({ id, label, type: 'radio', ...display })
  })

  return windowedDisplays
}

function getDisplays() {
  let displays = []
  electron.screen.getAllDisplays().find((display) => {
    displays.push({ x: display.bounds.x, y: display.bounds.y, width: display.bounds.width, height: display.bounds.height })
  })

  return displays
}

function checkOffscreenPoints(window, screen) {
  let requested = {}
  let minimum = {}
  let maximum = {}

  requested.x = Math.abs(window.x)
  requested.y = Math.abs(window.y)
  minimum.x = Math.abs(screen.bounds.x)
  minimum.y = Math.abs(screen.bounds.y)

  if (screen.bounds.x < 0 || screen.bounds.y < 0) {
    maximum.x = Math.abs(screen.size.width - screen.bounds.x)
    maximum.y = Math.abs(screen.size.height - screen.bounds.y)
  } else {
    maximum.x = Math.abs(screen.size.width + screen.bounds.x)
    maximum.y = Math.abs(screen.size.height + screen.bounds.y)
  }

  return (requested.x >= minimum.x && requested.x >= maximum.x || requested.y >= minimum.y && requested.y >= maximum.y)
}

module.exports.getFullscreenDisplays = getFullscreenDisplays
module.exports.getWindowedDisplays = getWindowedDisplays
module.exports.getDisplays = getDisplays
module.exports.checkOffscreenPoints = checkOffscreenPoints