const deck = require('../../methods/deck')

module.exports = () => {
  return {
    label: 'Deck',
    submenu: [
      { id: 'new', label: 'New...', click: deck.addNew },
      { type: 'separator' },
      { id: 'insertBefore', label: 'Insert Before...' },
      { id: 'insertAfter', label: 'Insert After...' },
      { type: 'separator' },
      { id: 'duplicate', label: 'Duplicate' },
      { id: 'rename', label: 'Rename' },
      { type: 'separator' },
      { id: 'clear', label: 'Clear' },
      { id: 'remove', label: 'Remove' },
    ]
  }
}