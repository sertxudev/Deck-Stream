const electron = require('electron')
const { dialog, BrowserWindow } = require('electron')
const electronLocalshortcut = require('electron-localshortcut')
const fs = require('fs')
const config = require('./config')
const displays = require('./displays')
const project = require('./project')

function openBrowser() {
  return dialog.showOpenDialogSync({ properties: ['openFile'], filters: [{ name: 'Deck Stream File', extensions: ['dsf'] }] })
}

function loadFile(url) {
  let data = fs.readFileSync(url, 'utf8')
  data = JSON.parse(data)

  project.addRecent(data.name, url)

  return processConfig(data)
}

function processConfig(data) {  
  if (!!Object.keys(data).length) {
    let decks = []

    data.decks.forEach((deck, index) => {
      let outputs = []
      let outputsIDs = []
      
      deck.outputs.forEach((output) => {
        let screen = electron.screen.getDisplayNearestPoint({ x: output.x, y: output.y })

        if (displays.checkOffscreenPoints(output, screen)) {
          output.x = screen.bounds.x
          output.y = screen.bounds.y
        }

        let window = new BrowserWindow({
          x: output.x, y: output.y, width: output.width, height: output.height, alwaysOnTop: true, closable: false,
          title: deck.name, backgroundColor: '#000', parent: global.win, webPreferences: { nodeIntegration: true }
        })

        window.loadFile('./dist/livestream.html')
        electronLocalshortcut.register(window, 'F11', () => window.setFullScreen(!window.isFullScreen()))
        if (output.fullscreened) window.setFullScreen(true)
        if (output.maximized) window.maximize()
        // window.setMenu(null)
        outputs.push(window)

        outputsIDs.push(window.id)
      })

      deck.outputs = outputsIDs
      decks.push(deck)
      global.winout[index] = outputs
    })

    data.decks = decks
  }

  return data
}

function saveFile(url, data) {
  if(!url || url == '.') return project.saveAs()
  project.addRecent(data.name, url)
  fs.writeFileSync(url, JSON.stringify(data), 'utf-8')
}

module.exports.openBrowser = openBrowser
module.exports.loadFile = loadFile
module.exports.processConfig = processConfig
module.exports.saveFile = saveFile