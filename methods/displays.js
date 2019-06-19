const electron = require('electron')
const { BrowserWindow, ipcMain } = require('electron')
const electronLocalshortcut = require('electron-localshortcut')

function getFullscreenDisplays() {
  let displays = getDisplays()
  let fullscreenDisplays = []

  displays.forEach((display, index) => {
    ++index
    let id = `display${index}`
    let label = `Display${index} (${display.width}x${display.height})`
    let accelerator = `CommandOrControl+Shift+${index}`
    fullscreenDisplays.push({ id, label, accelerator, click: createOutput, ...display })
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
    windowedDisplays.push({ id, label, click: createOutput, ...display })
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

function createOutput(menuItem) {
  let index = menuItem.id.split('display')[1]
  let display = getDisplays()[index - 1]

  global.win.send('get-activeDeck')
  ipcMain.once('get-activeDeck', (event, argv) => {
    let window = new BrowserWindow({
      x: display.x, y: display.y, width: 1280, height: 720, alwaysOnTop: true,
      title: argv.name, backgroundColor: '#000', parent: global.win, webPreferences: { nodeIntegration: true }
    })

    window.loadFile('./dist/livestream.html', { query: { id: argv.id } })
    electronLocalshortcut.register(window, 'F11', () => window.setFullScreen(!window.isFullScreen()))
    if (menuItem.accelerator) window.setFullScreen(true)
    // window.setMenu(null)

    if (!global.winout[argv.id]) global.winout[argv.id] = []
    global.winout[argv.id].push(window)
    global.win.send('add-output', window.id)
  })
}

function createPreviewMonitorOutput(menuItem) {
  let display = getDisplays()[0]

  let window = new BrowserWindow({
    x: display.x, y: display.y, width: 1280, height: 720,
    backgroundColor: '#000', parent: global.win, webPreferences: { nodeIntegration: true }
  })

  window.loadFile('./dist/previewmonitor.html')
  electronLocalshortcut.register(window, 'F11', () => window.setFullScreen(!window.isFullScreen()))
  if (menuItem.accelerator) window.setFullScreen(true)
  // window.setMenu(null)

  // if (!global.winout[argv.id]) global.winout[argv.id] = []
  // global.winout[argv.id].push(window)
  // global.win.send('add-output', window.id)
}

function disableOutputs() {
  global.win.send('get-activeDeck')
  ipcMain.once('get-activeDeck', (event, argv) => {
    argv.outputs.forEach(id => {
      let window = BrowserWindow.fromId(id)
      if (window) window.destroy()
    })
    global.win.send('disable-outputs')
  })
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
module.exports.createPreviewMonitorOutput = createPreviewMonitorOutput
module.exports.disableOutputs = disableOutputs
module.exports.checkOffscreenPoints = checkOffscreenPoints