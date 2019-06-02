module.exports = () => {
  return {
    label: 'Application',
    submenu: [
      { id: 'preferences', label: 'Preferences...' },
      { id: 'about', label: 'About' },
      { id: 'checkUpdates', label: 'Check for updates...' },
      { label: 'Learn More', click() { require('electron').shell.openExternalSync('https://deckstream.sertxudeveloper.com') } },
      { type: 'separator' },
      process.platform === 'darwin' ? { role: 'close' } : { role: 'quit' },
    ]
  }
}