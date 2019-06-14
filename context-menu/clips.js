
function openSettings(element) {
  console.log('Settings - Group ' + element.id.split('-')[1] + ' - Clip ' + element.id.split('-')[2])
}

module.exports.openSettings = openSettings