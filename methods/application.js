
function openWith(e, path) {
  if (e) e.preventDefault()
  global.filePath = path ? path : process.argv[1]
}

module.exports.openWith = openWith