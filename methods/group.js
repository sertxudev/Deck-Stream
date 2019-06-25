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

function editGroup(group, dIndex, gIndex) {
  let modal = new BrowserWindow({
    height: 180, width: 400, parent: global.win, minimizable: false, modal: true,
    maximizable: false, resizable: false, show: false, webPreferences: { nodeIntegration: true }
  })
  modal.loadFile('./modals/edit-group/index.html', { query: { name: group.name } })
  modal.once('ready-to-show', () => modal.show())
  modal.setMenu(null)

  modal.on('close', () => ipcMain.removeListener('edit-group', listener))
  ipcMain.once('edit-group', listener)

  function listener(event, argv) {
    modal.destroy()

    if (!argv.cancelled) {
      global.win.focus()
      global.win.send('edit-group', { name: argv.name, dIndex, gIndex })
      return true
    }

    return false
  }
}

module.exports.addNew = addNew
module.exports.editGroup = editGroup