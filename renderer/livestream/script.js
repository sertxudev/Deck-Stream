const { ipcRenderer } = require('electron')

import 'bootstrap/dist/css/bootstrap.min.css'
import './style.css'

import $ from 'jquery'
// import Popper from 'popper.js'
// import 'bootstrap'
// import draggable from 'vuedraggable'

window.$ = $
// $(() => $('[data-toggle="tooltip"]').tooltip())
// Popper.Defaults.modifiers.computeStyle.gpuAcceleration = !(window.devicePixelRatio < 1.5 && /Win/.test(navigator.platform))

let video_actual = 'videoA'
let video_other = 'videoB'
let fadeDuration = 500

ipcRenderer.on('enable-stream', (event, url) => {
  changeVideos()

  $(`#${video_actual}`).hide()

  if ($(`#${video_actual}`)[0].src != url) $(`#${video_actual}`)[0].src = url

  $(`#${video_actual}`)[0].play()
  $(`#${video_actual}`).fadeIn(fadeDuration)

  $(`#${video_other}`).fadeOut(fadeDuration)
  setTimeout(() => $(`#${video_other}`)[0].pause(), fadeDuration)
})

ipcRenderer.on('set-preload', (event, url) => {
  $(`#${video_other}`)[0].src = url
})

ipcRenderer.on('time-update', (event, updatedTime) => {
  $(`#${video_actual}`)[0].currentTime = updatedTime
})

function changeVideos() {
  video_actual = (video_actual == 'videoA') ? 'videoB' : 'videoA'
  video_other = (video_other == 'videoA') ? 'videoB' : 'videoA'
}

$(document).ready(() => {
  $(`#videoA`).hide();
  $(`#videoB`).hide();
  
  $(`#videoA`)[0].onended = () => $(`#videoA`).fadeOut(fadeDuration)
  $(`#videoB`)[0].onended = () => $(`#videoB`).fadeOut(fadeDuration)
})
