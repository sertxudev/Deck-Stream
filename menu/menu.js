let application = require('./parts/application')
let project = require('./parts/project')
let deck = require('./parts/deck')
let group = require('./parts/group')
let clip = require('./parts/clip')
let outputs = require('./parts/outputs')

function build() {
  return [
    application(),
    project(),
    deck(),
    group(),
    clip(),
    outputs(),
    { role: "toggledevtools" }
  ]
}

module.exports.build = build