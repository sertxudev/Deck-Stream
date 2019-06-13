const { app, BrowserWindow, ipcMain, Menu, globalShortcut } = require('electron')

function addNew(menuItem, window) {
  let modal = new BrowserWindow({
    height: 280, width: 400, parent: window, minimizable: false,
    maximizable: false, resizable: false, show: false, webPreferences: { nodeIntegration: true }
  })
  modal.loadFile('./modals/add-group/index.html')
  modal.once('ready-to-show', () => {
    global.win.webContents.send('get-data')

    ipcMain.once('get-data', (event, data) => {
      let groups = []
      data.decks[data.activeDeck].groups.forEach(el => groups.push({ name: el.name }))
      modal.webContents.send('get-groups', groups)
    })
    modal.show()
  })
  modal.setMenu(null)

  modal.on('close', () => ipcMain.removeListener('add-group', addGroup))

  ipcMain.once('add-group', addGroup)

  function addGroup(event, argv) {
    modal.destroy()

    if (!argv.cancelled) {
      global.win.focus()
      global.win.send('add-group', { name: argv.name, position: argv.position })
      return true
    }

    return false
  }
}

module.exports.addNew = addNew