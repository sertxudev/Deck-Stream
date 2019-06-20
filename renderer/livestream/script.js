const { ipcRenderer } = require('electron')
import Vue from 'vue'
import Vuex from 'vuex'
import sharedMutations from 'vuex-shared-mutations'

import App from './components/App.vue'

import 'bootstrap/dist/css/bootstrap.min.css'
import './style.css'

import $ from 'jquery'
import { ipcMain } from 'electron';
window.$ = $

Vue.use(Vuex)

const urlParams = new URLSearchParams(window.location.search)
const deckID = urlParams.get('id')
const fadeDuration = urlParams.get('fadeDuration')

const store = new Vuex.Store({
  state: {
    player: { src: "", currentTime: null, id: 'videoA' },
    image: { src: "", id: 'imageA' },
    fadeDuration,
    previousEnableFade: false
  },
  mutations: {
    changeSource(state, payload) {
      if (deckID !== payload.id) return null

      let enabledFade = payload.enableFade || state.previousEnableFade
      console.log(payload.enableFade || state.previousEnableFade, payload.enableFade, state.previousEnableFade)
      state.previousEnableFade = payload.enableFade

      state.player.id = (state.player.id == 'videoA') ? 'videoB' : 'videoA'
      let video_other = (state.player.id == 'videoA') ? 'videoB' : 'videoA'

      state.image.id = (state.image.id == 'imageA') ? 'imageB' : 'imageA'
      let image_other = (state.image.id == 'imageA') ? 'imageB' : 'imageA'

      if (enabledFade) {
        $('#blackout').fadeIn(state.fadeDuration / 2)
      } else {
        $('#blackout').hide()
      }

      setTimeout(() => {
        if (fileIsVideo(payload.src)) {
          $(`#${state.player.id}`)[0].src = payload.src

          $(`#${state.player.id}`)[0].oncanplaythrough = () => {
            $(`#${image_other}`).hide()
            $(`#${image_other}`)[0].src = ''

            $(`#${video_other}`).hide()
            $(`#${video_other}`)[0].src = ''
          }

          $(`#${state.player.id}`).show()
          $(`#${state.player.id}`)[0].loop = payload.loop
          $(`#${state.player.id}`)[0].play()

          if (!payload.pauseOnEnd) {
            $(`#${state.player.id}`)[0].onended = () => {
              if (enabledFade) $('#blackout').fadeIn(state.fadeDuration / 2)
              $(`#${state.player.id}`).hide()
              $(`#${state.player.id}`)[0].src = ''
            }
          }

          if (enabledFade) $('#blackout').fadeOut(state.fadeDuration / 2)
        } else if (fileIsImage(payload.src)) {
          $(`#${video_other}`).hide()
          $(`#${video_other}`)[0].src = ''

          $(`#${image_other}`).hide()
          $(`#${image_other}`)[0].src = ''

          $(`#${state.image.id}`)[0].src = payload.src
          $(`#${state.image.id}`).show()
          if (enabledFade) $('#blackout').fadeOut(state.fadeDuration / 2)
        } else {
          $(`#${video_other}`).hide()
          $(`#${video_other}`)[0].src = ''

          $(`#${image_other}`).hide()
          $(`#${image_other}`)[0].src = ''

          $(`#${state.image.id}`).hide()
          $(`#${state.image.id}`)[0].src = ''

          $(`#${state.player.id}`).hide()
          $(`#${state.player.id}`)[0].src = ''
          return null
        }
      }, (enabledFade ? state.fadeDuration / 2 : 0))
    },
    updateCurrentTime(state, payload) {
      if (deckID !== payload.id) return null
      state.player.currentTime = payload.currentTime
    },
    changePreviewSource(state, payload) {
      return false
    },
    updateRemainingTime(state, payload) {
      return false
    },
    updateFadeDuration(state, fadeDuration) {
      state.fadeDuration = fadeDuration
    }
  },
  plugins: [sharedMutations({ predicate: ['changeSource', 'changePreviewSource', 'updateCurrentTime', 'updateRemainingTime', 'updateFadeDuration'] })]
})

new Vue({
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