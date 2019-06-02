const project = require('../../methods/project')

module.exports = () => {
  return {
    label: 'Project',
    submenu: [
      { id: 'new', label: 'New', accelerator: 'CommandOrControl+N', click: project.newProject },
      { type: 'separator' },
      { id: 'open', label: 'Open...', accelerator: 'CommandOrControl+O', click: project.openProject },
      { id: 'openRecent', label: 'Open Recent', submenu: project.getRecents() },
      { type: 'separator' },
      { id: 'save', label: 'Save', accelerator: 'CommandOrControl+S', click: project.save },
      { id: 'saveAs', label: 'Save As...', accelerator: 'CommandOrControl+Shift+S', click: project.saveAs },
      { type: 'separator' },
      { id: 'settings', label: 'Settings', accelerator: 'CommandOrControl+Shift+C' },
    ]
  }
}