const { Menu } = require('electron')
const project = require('./project')
const menuTemplate = require('../menu/menu')

function buildMenu() {
  const menu = Menu.buildFromTemplate(menuTemplate.build())
  global.win.setMenu(menu)
}

module.exports.buildMenu = buildMenu