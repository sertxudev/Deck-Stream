const { app, BrowserWindow, ipcMain, Menu, globalShortcut } = require('electron')

function addNew(menuItem, window) {
  let modal = new BrowserWindow({
    height: 390, width: 400, parent: window, minimizable: false, modal: true,
    maximizable: false, resizable: false, show: false, webPreferences: { nodeIntegration: true }
  })
  modal.loadFile('./modals/add-clip/index.html')
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

  modal.on('close', () => ipcMain.removeListener('add-clip', addClip))

  ipcMain.once('add-clip', addClip)

  function addClip(event, argv) {
    modal.destroy()

    if (!argv.cancelled) {
      global.win.focus()
      global.win.send('add-clip', { name: argv.name, path: argv.path, group: argv.group, loop: argv.loop })
      return true
    }

    return false
  }
}

module.exports.addNew = addNew