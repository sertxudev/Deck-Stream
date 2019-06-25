const { app, BrowserWindow, ipcMain, Menu, globalShortcut } = require('electron')
const path = require('path')

function addNew(menuItem, window) {
  let modal = new BrowserWindow({
    height: 280, width: 400, parent: window, minimizable: false, modal: true,
    maximizable: false, resizable: false, show: false, webPreferences: { nodeIntegration: true }
  })
  modal.loadFile(path.join(__dirname, '/modals/add-deck/index.html'))
  modal.once('ready-to-show', () => {
    global.win.webContents.send('get-data')

    ipcMain.once('get-data', (event, data) => {
      let decks = []
      data.decks.forEach(el => decks.push({ name: el.name }))
      modal.webContents.send('get-decks', decks)
    })
    modal.show()
  })
  modal.setMenu(null)

  modal.on('close', () => ipcMain.removeListener('add-deck', addDeck))

  ipcMain.once('add-deck', addDeck)

  function addDeck(event, argv) {
    modal.destroy()

    if (!argv.cancelled) {
      global.win.focus()
      global.win.send('add-deck', { name: argv.name, position: argv.position })
      return true
    }

    return false
  }
}

module.exports.addNew = addNew