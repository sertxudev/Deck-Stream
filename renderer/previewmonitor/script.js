const { ipcRenderer } = require('electron')
import Vue from 'vue'
import Vuex from 'vuex'
import sharedMutations from 'vuex-shared-mutations'

import App from './components/App.vue'

import 'bootstrap/dist/css/bootstrap.min.css'
import './style.css'

import $ from 'jquery'
window.$ = $

Vue.use(Vuex)

let ids = ipcRenderer.sendSync('getDecksIds')
let players = {}
let images = {}
let playersPreview = {}
let imagesPreview = {}

ids.forEach(id => {
  players[id] = { currentTime: null, remainingTime: null, id: 'videoA' }
  images[id] = { currentTime: null, id: 'imageA' }
  playersPreview[id] = { currentTime: null, remainingTime: null, id: 'videoA' }
  imagesPreview[id] = { currentTime: null, id: 'imageA' }
})

const store = new Vuex.Store({
  state: {
    // player: { src: "", currentTime: null, id: 'videoA' },
    // image: { src: "", id: 'imageA' },
    // fadeDuration: 500
    decks: ids,
    players,
    images,
    playersPreview,
    imagesPreview,
    fadeDuration: 500
  },
  mutations: {
    changeSource(state, payload) {
      if (!state.players[payload.id]) return null

      state.players[payload.id].id = (state.players[payload.id].id == 'videoA') ? 'videoB' : 'videoA'
      let video_other = (state.players[payload.id].id == 'videoA') ? 'videoB' : 'videoA'

      state.images[payload.id].id = (state.images[payload.id].id == 'imageA') ? 'imageB' : 'imageA'
      let image_other = (state.images[payload.id].id == 'imageA') ? 'imageB' : 'imageA'

      $(`#deck-${payload.id} #blackout`).fadeIn(state.fadeDuration / 2)

      setTimeout(() => {
        if (fileIsVideo(payload.src)) {
          $(`#deck-${payload.id} #${image_other}`).hide()
          $(`#deck-${payload.id} #${image_other}`)[0].src = ''

          $(`#deck-${payload.id} #${video_other}`).hide()
          $(`#deck-${payload.id} #${video_other}`)[0].src = ''

          $(`#deck-${payload.id} #${state.players[payload.id].id}`)[0].src = payload.src
          $(`#deck-${payload.id} #${state.players[payload.id].id}`).show()
          $(`#deck-${payload.id} #${state.players[payload.id].id}`)[0].play()

          $(`#deck-${payload.id} #${state.players[payload.id].id}`)[0].onended = () => {
            $(`#deck-${payload.id} #blackout`).fadeIn(state.fadeDuration / 2)
            $(`#deck-${payload.id} #${state.players[payload.id].id}`).hide()
            $(`#deck-${payload.id} #${state.players[payload.id].id}`)[0].src = ''
          }

          $(`#deck-${payload.id} #blackout`).fadeOut(state.fadeDuration / 2)
        } else if (fileIsImage(payload.src)) {
          $(`#deck-${payload.id} #${video_other}`).hide()
          $(`#deck-${payload.id} #${video_other}`)[0].src = ''

          $(`#deck-${payload.id} #${image_other}`).hide()
          $(`#deck-${payload.id} #${image_other}`)[0].src = ''

          $(`#deck-${payload.id} #${state.images[payload.id].id}`)[0].src = payload.src
          $(`#deck-${payload.id} #${state.images[payload.id].id}`).show()
          state.images[payload.id].currentTime = 0
          $(`#deck-${payload.id} #blackout`).fadeOut(state.fadeDuration / 2)
        } else {
          $(`#deck-${payload.id} #${video_other}`).hide()
          $(`#deck-${payload.id} #${video_other}`)[0].src = ''

          $(`#deck-${payload.id} #${image_other}`).hide()
          $(`#deck-${payload.id} #${image_other}`)[0].src = ''

          $(`#deck-${payload.id} #${state.images[payload.id].id}`).hide()
          $(`#deck-${payload.id} #${state.images[payload.id].id}`)[0].src = ''

          $(`#deck-${payload.id} #${state.players[payload.id].id}`).hide()
          $(`#deck-${payload.id} #${state.players[payload.id].id}`)[0].src = ''
          return null
        }
      }, state.fadeDuration / 2)
    },
    changePreviewSource(state, payload) {
      state.playersPreview[payload.id].id = (state.playersPreview[payload.id].id == 'videoA') ? 'videoB' : 'videoA'
      let video_other = (state.playersPreview[payload.id].id == 'videoA') ? 'videoB' : 'videoA'

      state.imagesPreview[payload.id].id = (state.imagesPreview[payload.id].id == 'imageA') ? 'imageB' : 'imageA'
      let image_other = (state.imagesPreview[payload.id].id == 'imageA') ? 'imageB' : 'imageA'

      $(`#deck-${payload.id}-preview #blackout`).fadeIn(state.fadeDuration / 2)

      setTimeout(() => {
        if (fileIsVideo(payload.src)) {
          $(`#deck-${payload.id}-preview #${image_other}`).hide()
          $(`#deck-${payload.id}-preview #${image_other}`)[0].src = ''

          $(`#deck-${payload.id}-preview #${video_other}`).hide()
          $(`#deck-${payload.id}-preview #${video_other}`)[0].src = ''

          $(`#deck-${payload.id}-preview #${state.playersPreview[payload.id].id}`)[0].src = payload.src
          $(`#deck-${payload.id}-preview #${state.playersPreview[payload.id].id}`).show()
          $(`#deck-${payload.id}-preview #${state.playersPreview[payload.id].id}`)[0].play()

          $(`#deck-${payload.id}-preview #${state.playersPreview[payload.id].id}`)[0].onended = () => {
            $(`#deck-${payload.id}-preview #blackout`).fadeIn(state.fadeDuration / 2)
            $(`#deck-${payload.id}-preview #${state.playersPreview[payload.id].id}`).hide()
            $(`#deck-${payload.id}-preview #${state.playersPreview[payload.id].id}`)[0].src = ''
          }

          $(`#deck-${payload.id}-preview #blackout`).fadeOut(state.fadeDuration / 2)
        } else if (fileIsImage(payload.src)) {
          $(`#deck-${payload.id}-preview #${video_other}`).hide()
          $(`#deck-${payload.id}-preview #${video_other}`)[0].src = ''

          $(`#deck-${payload.id}-preview #${image_other}`).hide()
          $(`#deck-${payload.id}-preview #${image_other}`)[0].src = ''

          $(`#deck-${payload.id}-preview #${state.imagesPreview[payload.id].id}`)[0].src = payload.src
          $(`#deck-${payload.id}-preview #${state.imagesPreview[payload.id].id}`).show()
          state.imagesPreview[payload.id].currentTime = 0
          $(`#deck-${payload.id}-preview #blackout`).fadeOut(state.fadeDuration / 2)
        } else {
          $(`#deck-${payload.id}-preview #${video_other}`).hide()
          $(`#deck-${payload.id}-preview #${video_other}`)[0].src = ''

          $(`#deck-${payload.id}-preview #${image_other}`).hide()
          $(`#deck-${payload.id}-preview #${image_other}`)[0].src = ''

          $(`#deck-${payload.id}-preview #${state.imagesPreview[payload.id].id}`).hide()
          $(`#deck-${payload.id}-preview #${state.imagesPreview[payload.id].id}`)[0].src = ''

          $(`#deck-${payload.id}-preview #${state.playersPreview[payload.id].id}`).hide()
          $(`#deck-${payload.id}-preview #${state.playersPreview[payload.id].id}`)[0].src = ''
          return null
        }
      }, state.fadeDuration / 2)
    },
    updateCurrentTime(state, payload) {
      state.players[payload.id].currentTime = payload.currentTime
    }
  },
  plugins: [sharedMutations({ predicate: ['changeSource', 'changePreviewSource', 'updateCurrentTime'] })]
})

const app = new Vue({
  components: { App },
  store,
  template: '<App ref="app"></App>'
}).$mount('#app')


function fileIsVideo(filename) {
  return filename
    .split(".")
    .pop()
    .match(/(webm|ogg|mp4)$/i);
}

function fileIsImage(filename) {
  return filename
    .split(".")
    .pop()
    .match(/(jpg|jpeg|png|gif)$/i);
}