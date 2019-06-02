const electron = require('electron')
const menu = require('./menu')

function enableEvents() {
  electron.screen.on('display-added', menu.buildMenu)
  electron.screen.on('display-removed', menu.buildMenu)
  electron.screen.on('display-metrics-changed', menu.buildMenu)
}

module.exports.enableEvents = enableEvents