const group = require('../../methods/group')

module.exports = () => {
  return {
    label: 'Group',
    submenu: [
      { id: 'new', label: 'New...', click: group.addNew },
      { type: 'separator' },
      { id: 'duplicate', label: 'Duplicate' },
      { id: 'rename', label: 'Rename' },
      { type: 'separator' },
      {
        id: 'moveToDeck', label: 'Move to Deck', submenu: [
          { label: 'None', enabled: false }
        ]
      },
      { type: 'separator' },
      { id: 'clearClips', label: 'Clear Clips' },
    ]
  }
}