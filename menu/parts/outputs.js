const displays = require('../../methods/displays')

module.exports = () => {
  return {
    label: 'Outputs',
    submenu: [
      { id: 'disabled', label: 'Disabled', click: displays.disableOutputs },
      { type: 'separator' },
      { id: 'fullscreen', label: 'Fullscreen', submenu: displays.getFullscreenDisplays() },
      { id: 'windowed', label: 'Windowed', submenu: displays.getWindowedDisplays() },
      { type: 'separator' },
      { id: 'previewMonitor', label: 'Preview Monitor', click: displays.createPreviewMonitorOutput },
      { type: 'separator' },
      { id: 'showTestCard', label: 'Show Test Card' },
      { id: 'showDisplayInfo', label: 'Show Display Info' },
    ]
  }
}