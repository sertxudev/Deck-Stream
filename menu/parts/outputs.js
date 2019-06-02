const displays = require('../../methods/displays')

module.exports = () => {
  return {
    label: 'Outputs',
    submenu: [
      { id: 'disabled', label: 'Disabled' },
      { type: 'separator' },
      { id: 'fullscreen', label: 'Fullscreen', submenu: displays.getFullscreenDisplays() },
      { id: 'windowed', label: 'Windowed', submenu: displays.getWindowedDisplays() },
      { type: 'separator' },
      { id: 'showTestCard', label: 'Show Test Card' },
      { id: 'showDisplayInfo', label: 'Show Display Info' },
    ]
  }
}