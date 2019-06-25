const { BrowserWindow, ipcMain, dialog } = require('electron')
const fs = require('fs')
const path = require('path')
const config = require('./config')
const file = require('./file')
const menu = require('./menu')
const displays = require('./displays')

function getBlank() {
  return {
    "name": "undefined", "description": null, "decks": [{
      "id": "py4q7bzrb", "name": "Deck 1", "outputs": [], "groups": [{
        "name": "Group 1", "clips": [
          // { "path": path.join(__dirname, "/assets/black.jpg"), "name": "Blackout" }
        ]
      }]
    }],
    "activeDeck": 0,
    "activeGroup": 0,
    "activeClip": 0,
    "fadeDuration": 0
  }
}

function newProject() {
  global.filePath = null
  displays.disableOutputs()
  global.winout = []
  global.win.reload()
}

function openProject() {
  let filePaths = file.openBrowser()
  if (!filePaths || !filePaths[0]) return false
  global.filePath = filePaths[0]
  global.win.reload()
}

function openRecent(menuItem, window) {
  if (!fs.existsSync(menuItem.sublabel)) {
    dialog.showMessageBoxSync(window, {
      type: 'error',
      title: 'File not found',
      message: 'The requested file doesn\'t exist'
    })
    removeRecent(menuItem.sublabel)
    return false
  }

  global.filePath = menuItem.sublabel
  global.win.reload()
}

function getRecents() {
  return (config.has('recents') && config.get('recents').length) ? formatRecents(config.get('recents')) : [{ label: 'No Recent Projects', enabled: false }]
}

function addRecent(name, url) {
  let recents = config.has('recents') ? config.get('recents') : []
  recents = recents.filter((recent) => recent.sublabel != url)
  recents.unshift({ label: name, sublabel: url })
  config.set('recents', recents)
  menu.buildMenu()
}

function removeRecent(url) {
  let recents = config.has('recents') ? config.get('recents') : []
  recents = recents.filter((recent) => recent.sublabel != url)
  config.set('recents', recents)
  menu.buildMenu()
}

function formatRecents(recents) {
  recents.forEach(recent => recent.click = openRecent)
  return recents
}

function save() {
  global.win.webContents.send('get-data')
  ipcMain.once('get-data', (event, data) => {
    data = processDataSave(data)
    file.saveFile(global.filePath, data)
  })
}

function saveAs() {
  global.win.webContents.send('get-name')
  ipcMain.once('get-name', (event, name) => {
    let path = dialog.showSaveDialogSync({ filters: [{ name: 'Deck Stream File', extensions: ['dsf'] }], defaultPath: `*/${name}` })
    if (!path) return false
    global.filePath = path
    return save()
  })
}

function changeSettings(menuItem, window) {
  let modal

  window.webContents.send('get-data')
  ipcMain.once('get-data', (event, argv) => {
    modal = new BrowserWindow({
      height: 420, width: 400, modal: true, alwaysOnTop: true, parent: window, minimizable: false,
      maximizable: false, resizable: false, show: false, webPreferences: { nodeIntegration: true }
    })
    modal.loadFile(path.join(__dirname, '/modals/settings/index.html'), { query: { name: argv.name, description: argv.description, fadeDuration: argv.fadeDuration } })
    modal.once('ready-to-show', () => modal.show())
    modal.setMenu(null)
    modal.on('close', () => ipcMain.removeListener('save-settings', saveSettingsEvent))
  })

  ipcMain.once('save-settings', saveSettingsEvent)

  function saveSettingsEvent(event, argv) {
    modal.destroy()

    if (!argv.cancelled) {
      global.win.send('update-settings', { name: argv.name, description: argv.description, fadeDuration: argv.fadeDuration })
      global.win.setTitle('Deck Stream - ' + argv.name)
      return true
    }

    return false
  }
}

function processDataSave(data) {
  data.decks.forEach(deck => {
    let outputs = []

    // if(deck.outputs.length) {
    deck.outputs.forEach(id => {
      let window = BrowserWindow.fromId(id)
      if (!window) return null
      let output = { ...window.getBounds(), maximized: window.isMaximized(), fullscreened: window.isFullScreen() }
      outputs.push(output)
    })
    // }

    deck.outputs = outputs
  })

  return data
}

module.exports.getBlank = getBlank
module.exports.newProject = newProject
module.exports.openProject = openProject
module.exports.openRecent = openRecent
module.exports.getRecents = getRecents
module.exports.addRecent = addRecent
module.exports.removeRecent = removeRecent
module.exports.save = save
module.exports.saveAs = saveAs
module.exports.changeSettings = changeSettings
module.exports.processDataSave = processDataSave