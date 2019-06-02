module.exports = () => {
  return {
    label: 'Clip',
    submenu: [
      { id: 'new', label: 'New...' },
      { type: 'separator' },
      { id: 'rename', label: 'Rename' },
      { id: 'showInExplorer', label: 'Show in Explorer' },
      { type: 'separator' },
      { id: 'moveToDeck', label: 'Move to Deck...' },
      {
        id: 'moveToGroup', label: 'Move to Group', submenu: [
          { label: 'None', enabled: false }
        ]
      },
      { type: 'separator' },
      {
        id: 'settings', label: 'Settings', submenu: [
          { id: 'thumbnail', label: 'Thumbnail...' },
          { id: 'timeline', label: 'Timeline...' },
          { id: 'scale', label: 'Scale...' },
          { id: 'rotation', label: 'Rotation...' },
        ]
      }
    ]
  }
}