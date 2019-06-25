const { app, BrowserWindow, ipcMain, Menu, globalShortcut } = require('electron')

function addNew(menuItem, window) {
  let modal = new BrowserWindow({
    height: 600, width: 400, parent: window, minimizable: false, modal: true,
    maximizable: false, resizable: false, show: false, webPreferences: { nodeIntegration: true }
  })
  modal.loadFile(path.join(__dirname, '/modals/add-clip/index.html'))
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

  modal.on('close', () => ipcMain.removeListener('add-clip', listener))

  ipcMain.once('add-clip', listener)

  function listener(event, argv) {
    modal.destroy()

    if (!argv.cancelled) {
      global.win.focus()
      global.win.send('add-clip', { name: argv.name, posterTime: argv.posterTime, color: argv.color, path: argv.path, group: argv.group, loop: argv.loop, pauseOnEnd: argv.pauseOnEnd, enableFade: argv.enableFade })
      return true
    }

    return false
  }
}

function editClip(clip, dIndex, gIndex, cIndex) {
  let modal = new BrowserWindow({
    height: 435, width: 400, parent: global.win, minimizable: false, modal: true,
    maximizable: false, resizable: false, show: false, webPreferences: { nodeIntegration: true }
  })
  modal.loadFile(path.join(__dirname, '/modals/edit-clip/index.html'), { query: { name: clip.name, posterTime: clip.posterTime, loop: clip.loop, pauseOnEnd: clip.pauseOnEnd, enableFade: clip.enableFade } })
  modal.once('ready-to-show', () => modal.show())
  modal.setMenu(null)

  modal.on('close', () => ipcMain.removeListener('edit-clip', listener))
  ipcMain.once('edit-clip', listener)

  function listener(event, argv) {
    modal.destroy()

    if (!argv.cancelled) {
      global.win.focus()
      global.win.send('edit-clip', { name: argv.name, posterTime: argv.posterTime, color: argv.color, loop: argv.loop, pauseOnEnd: argv.pauseOnEnd, enableFade: argv.enableFade, dIndex, gIndex, cIndex })
      return true
    }

    return false
  }
}

module.exports.addNew = addNew
module.exports.editClip = editClip