let stopwatch = require('./parts/stopwatch')
function build() {
  return [
    stopwatch(),
    { role: "toggledevtools" }
  ]
}

module.exports.build = build