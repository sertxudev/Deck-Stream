const { BrowserWindow, ipcMain, dialog } = require('electron')
const fs = require('fs')
const config = require('./config')
const file = require('./file')
const menu = require('./menu')

function getBlank() {
  return {
    "name": "undefined", "description": null, "decks": [{
      "name": "Deck 1", "outputs": [], "groups": [{
        "name": "Group 1", "clips": [{ "path": "../../assets/black.jpg", "name": "Blackout" }]
      }]
    }],
    "activeDeck": 0,
    "activeGroup": 0,
    "activeClip": 0
  }
}

function newProject() {
  global.filePath = null
  global.win.reload()
}

function openProject() {
  let filePaths = file.openBrowser()
  if (!filePaths ||!filePaths[0]) return false
  global.filePath = filePaths[0]
  global.win.reload()
}

function openRecent(menuItem) {
  if(!fs.existsSync(menuItem.sublabel)) {
    console.error('File not found')
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
  let path = dialog.showSaveDialogSync({ filters: [{ name: 'Deck Stream File', extensions: ['dsf'] }] })
  global.filePath = path
  return save()
}

function processDataSave(data) {
  data.decks.forEach(deck => {
    let outputs = []

    deck.outputs.forEach(id => {
      let window = BrowserWindow.fromId(id)
      let output = { ...window.getBounds(), maximized: window.isMaximized(), fullscreened: window.isFullScreen() }
      outputs.push(output)
    })

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
module.exports.processDataSave = processDataSave