module.exports = () => {
  return {
    label: 'Group',
    submenu: [
      { id: 'new', label: 'New...' },
      { type: 'separator' },
      { id: 'insertAbove', label: 'Insert Above...' },
      { id: 'insertBelow', label: 'Insert Below...' },
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