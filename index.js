const electron = require('electron')
const { app, BrowserWindow, ipcMain, Menu, globalShortcut } = require('electron')
const methods = require('./methods/methods')
const wallpaper = require('wallpaper');
let originalWallpaper = null

global.win = null
global.winout = []
global.filePath = null

function createWindow() {
  
  wallpaper.get().then(path => originalWallpaper = path)
  wallpaper.set('./assets/black.jpg')

  global.win = new BrowserWindow({ width: 800, height: 600, webPreferences: { nodeIntegration: true, webSecurity: false, show: false } })
  global.win.loadFile('./renderer/deckstream/index.html')
  // win.webContents.openDevTools({ mode: 'detach' })

  global.win.webContents.on('did-finish-load', () => win.show())


  global.win.on('closed', () => global.win = null)

  if (process.argv[1]) methods.application.openWith()

  ipcMain.on('load-data', (event, arg) => {
    global.winout.forEach(deck => deck.forEach(window => window.destroy()))

    let data = (!global.filePath || global.filePath == '.') ? methods.project.getBlank() : methods.file.loadFile(global.filePath)
    global.win.setTitle(`Deck Stream - ${data.name}`)
    event.returnValue = data
  })

  ipcMain.on('enable-stream', (event, arg) => {
    if (!global.winout.length || !global.winout[arg.deck].length) return false
    global.winout[arg.deck].forEach((output) => output.webContents.send('enable-stream', arg.url))
  })

  ipcMain.on('set-preload', (event, arg) => {
    if (!global.winout.length || !global.winout[arg.deck].length) return false
    global.winout[arg.deck].forEach((output) => output.webContents.send('set-preload', arg.url))
  })

  methods.menu.buildMenu()

  globalShortcut.register('mediaplaypause', () => null)

  methods.events.enableEvents()
}

// app.disableHardwareAcceleration()

// Este método será llamado cuando Electron haya terminado
// la inicialización y esté listo para crear ventanas del navegador.
// Algunas APIs pueden usarse sólo después de que este evento ocurra.
app.on('ready', createWindow)
app.on('open-file', methods.application.openWith)

// Sal cuando todas las ventanas hayan sido cerradas.
app.on('window-all-closed', () => {
  // En macOS es común para las aplicaciones y sus barras de menú
  // que estén activas hasta que el usuario salga explicitamente con Cmd + Q
  wallpaper.set(originalWallpaper).then(() => {
    if (process.platform !== 'darwin') app.quit()
  })
})

app.on('activate', () => {
  // En macOS es común volver a crear una ventana en la aplicación cuando el
  // icono del dock es clicado y no hay otras ventanas abiertas.
  if (global.win === null) createWindow()
})

// En este archivo puedes incluir el resto del código del proceso principal de
// tu aplicación. También puedes ponerlos en archivos separados y requerirlos aquí.

// function screenModified() {
//   buildMenu()
//   // global.win.webContents.send('get-data')
//   // ipcMain.once('get-data', (event, data) => {
//   //   data = methods.project.processDataSave(data)
//   // })
// }

// function newProject(menuItem, browserWindow, event) {
//   let json = {}
//   let modal = new BrowserWindow({
//     height: 300,
//     width: 400,
//     alwaysOnTop: true,
//     modal: true,
//     parent: browserWindow,
//     minimizable: false,
//     maximizable: false,
//     resizable: false,
//     webPreferences: { nodeIntegration: true }
//   })

//   modal.loadFile('./windows/modals/new-project/index.html')

//   ipcMain.on('create-project', (event, args) => {
//     console.log('ipcMain', args)
//   })
// }