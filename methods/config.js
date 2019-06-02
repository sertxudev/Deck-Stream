const Store = require('electron-store');
const store = new Store();


function set(key, value) {
  return store.set(key, value)
}

function get(key) {
  return store.get(key)
}

function remove(key) {
  return store.delete(key)
}

function has(key) {
  return store.has(key)
}

module.exports.set = set
module.exports.get = get
module.exports.remove = remove
module.exports.has = has