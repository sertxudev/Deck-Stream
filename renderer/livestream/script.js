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

const urlParams = new URLSearchParams(window.location.search)
const deckID = urlParams.get('id')

const store = new Vuex.Store({
  state: {
    player: { src: "", currentTime: null, id: 'videoA' },
    image: { src: "", id: 'imageA' },
    fadeDuration: 500
  },
  mutations: {
    changeSource(state, payload) {
      if(deckID !== payload.id) return null

      state.player.id = (state.player.id == 'videoA') ? 'videoB' : 'videoA'
      let video_other = (state.player.id == 'videoA') ? 'videoB' : 'videoA'

      state.image.id = (state.image.id == 'imageA') ? 'imageB' : 'imageA'
      let image_other = (state.image.id == 'imageA') ? 'imageB' : 'imageA'

      $('#blackout').fadeIn(state.fadeDuration / 2)

      setTimeout(() => {
        if (fileIsVideo(payload.src)) {
          $(`#${image_other}`).hide()
          $(`#${image_other}`)[0].src = ''

          $(`#${video_other}`).hide()
          $(`#${video_other}`)[0].src = ''

          $(`#${state.player.id}`)[0].src = payload.src
          $(`#${state.player.id}`).show()
          $(`#${state.player.id}`)[0].loop = payload.loop

          // ipcRenderer.once('play-video', (event, argv) => {
          // console.log('play-video')
          // if (deckID != argv.deck) return null
          $(`#${state.player.id}`)[0].play()
          // })

          $(`#${state.player.id}`)[0].onended = () => {
            $('#blackout').fadeIn(state.fadeDuration / 2)
            $(`#${state.player.id}`).hide()
            $(`#${state.player.id}`)[0].src = ''
          }

          $('#blackout').fadeOut(state.fadeDuration / 2)
        } else if (fileIsImage(payload.src)) {
          $(`#${video_other}`).hide()
          $(`#${video_other}`)[0].src = ''

          $(`#${image_other}`).hide()
          $(`#${image_other}`)[0].src = ''

          $(`#${state.image.id}`)[0].src = payload.src
          $(`#${state.image.id}`).show()
          $('#blackout').fadeOut(state.fadeDuration / 2)
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
      }, state.fadeDuration / 2)
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
    }
  },
  plugins: [sharedMutations({ predicate: ['changeSource', 'changePreviewSource', 'updateCurrentTime', 'updateRemainingTime'] })]
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