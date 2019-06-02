function launchClock(index) {
  var today = new Date()
  var h = checkTime(today.getHours())
  var m = checkTime(today.getMinutes())
  var s = checkTime(today.getSeconds())
  $(`#header-${index} > #clock`)[0].innerHTML = h + ":" + m + ":" + s
  var t = setTimeout(() => launchClock(index), 500)
}

function checkTime(i) {
  if (i < 10) { i = "0" + i }
  return i
}