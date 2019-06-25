const electron = require('electron')
const { app, BrowserWindow, ipcMain, Menu, globalShortcut } = require('electron')
const methods = require('./methods/methods')
const wallpaper = require('wallpaper')
const express = require('express')
const server = express()
const http = require('http').Server(server)
const io = require('socket.io')(http, { serveClient: false })
const path = require('path')

let originalWallpaper = null

global.win = null
global.winout = []
global.filePath = null

function createWindow() {

  wallpaper.get().then(path => originalWallpaper = path)
  wallpaper.set('./assets/black.jpg')

  global.win = new BrowserWindow({ width: 800, height: 600, webPreferences: { nodeIntegration: true, webSecurity: false }, show: false })
  global.win.loadFile(path.join(__dirname, './deckstream.html'))
  // win.webContents.openDevTools({ mode: 'detach' })

  global.win.webContents.on('did-finish-load', () => win.show())

  // global.win.on('closed', () => global.win = null)

  global.win.on('close', function (e) {
    var choice = electron.dialog.showMessageBoxSync(this, {
      type: 'question',
      buttons: ['Yes', 'No'],
      defaultId: 1,
      noLink: true,
      title: 'Confirm',
      message: 'Are you sure you want to quit?'
    })
    if (choice == 1) e.preventDefault()
  })

  if (process.argv[1]) methods.application.openWith()

  ipcMain.on('load-data', (event, arg) => {
    Object.keys(global.winout).forEach(deck => global.winout[deck].forEach(window => window.destroy()))

    let data = (!global.filePath || global.filePath == '.') ? methods.project.getBlank() : methods.file.loadFile(global.filePath)
    global.win.setTitle(`Deck Stream - ${data.name}`)
    event.returnValue = data
    io.emit('forceUpdate', data)
  })

  ipcMain.on('getDecksIds', (event) => {
    global.win.webContents.send('get-data')
    ipcMain.once('get-data', (ev, data) => {
      let ids = []
      data.decks.forEach(deck => ids.push(deck.id))
      event.returnValue = ids
    })
  })

  methods.menu.buildMenu()

  globalShortcut.register('mediaplaypause', () => null)

  methods.events.enableEvents()

  server.use(express.static(__dirname))

  server.get('/', function (req, res) {
    res.sendFile(path.join(__dirname,'remotecontrol.html'))
  })

  server.get('/file', function (req, res) {
    res.sendFile(req.query.url)
  })

  io.on('connection', (socket) => {
    global.win.webContents.send('get-data')
    ipcMain.once('get-data', (event, data) => {
      socket.emit('getData', data)
    })

    socket.on('refreshData', () => {
      global.win.webContents.send('get-data')
      ipcMain.once('get-data', (event, data) => {
        socket.emit('getData', data)
      })
    })

    socket.on('changeSource', (data) => {
      global.win.webContents.send('changeSource', data)
    })
  })

  http.listen(3000, function () {
    console.log('listening on *:3000')
  })

  ipcMain.on('update-data', (event, data) => io.emit('getData', data))
  ipcMain.on('current-live', (event, data) => io.emit('currentLive', data))
  ipcMain.on('update-current-time', (event, data) => io.emit('updateCurrentTime', data))
  ipcMain.on('update-remaining-time', (event, data) => io.emit('updateRemainingTime', data))
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

ipcMain.on('open-edit-clip', (event, argv) => methods.clips.editClip(argv.clip, argv.dIndex, argv.gIndex, argv.cIndex))
ipcMain.on('open-edit-group', (event, argv) => methods.group.editGroup(argv.group, argv.dIndex, argv.gIndex))
