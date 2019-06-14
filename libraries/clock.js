var t = []
function launchClock(index) {
  var today = new Date()
  var h = checkTime(today.getHours())
  var m = checkTime(today.getMinutes())
  var s = checkTime(today.getSeconds())
  $(`#header-${index} > #clock-${index}`)[0].innerHTML = h + ":" + m + ":" + s
  t[index] = setTimeout(() => launchClock(index), 500)
}

function checkTime(i) {
  if (i < 10) { i = "0" + i }
  return i
}

function clearClock(index) {
  clearTimeout(t[index])
}