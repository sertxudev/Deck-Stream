import Vue from 'vue'
import Vuex from 'vuex'
// import VueSocketIO from 'vue-socket.io'
import io from 'socket.io-client'

import App from './components/App.vue'

import 'bootstrap/dist/css/bootstrap.min.css'
import './style.css'

import $ from 'jquery'
window.$ = $

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    data: null,
    players: [],
    videos: [],
    images: [],
    actives: [],
    socket: io(window.location.host),
    currentLive: {
      id: null,
      clip: null
    },
    mounted: false
  },
  mutations: {
    changeSource(state, payload) {
      console.log('changeSource', payload)
    },
    currentLive(state, payload) {
      let index = null
      state.players.forEach((player, pos) => { if (player.id === this.getActiveDeckId) index = pos })
      console.log('currentLive', payload)
      // let index = state.players.findIndex((player) => player === payload.id)
      clearInterval(state.images[index].interval)
      clearInterval(state.videos[index].interval)
      if (fileIsVideo(payload.src)) {
        state.actives[index].live = 'video'
        state.actives[index].clip = payload.clip
        state.videos[index].currentTime = 0
        if (payload.loop) state.videos[index].interval = setInterval(() => state.videos[index].currentTime++, 1000)
      } else if (fileIsImage(payload.src)) {
        state.actives[index].live = 'image'
        state.actives[index].clip = payload.clip
        state.images[index].currentTime = 0
        state.images[index].interval = setInterval(() => state.images[index].currentTime++, 1000)
      } else {
        return null
      }
    },
    addPlayer(state, data) {
      let index = null
      state.players.forEach((player, pos) => { if (player.id === this.getActiveDeckId) index = pos })
      state.videos.splice(index, 0, { currentTime: '', remainingTime: '', interval: '' })
      state.images.splice(index, 0, { currentTime: '', interval: '' })
      state.actives.splice(index, 0, { live: '', clip: '' })
    }
  },
})

new Vue({
  components: { App },
  store,
  template: '<App ref="app"></App>',
  methods: {
    loadData: function () {
      this.$store.state.socket.on('getData', (data) => {
        this.$store.state.data = data
        this.buildPlayers()
        this.buildTiming()
        this.enableEvents()
        this.$store.state.mounted = true
      })
    },
    buildPlayers: function () {
      this.$store.state.data.decks.forEach((deck, index) => this.$store.state.players.push(deck.id))
    },
    buildTiming: function () {
      this.$store.state.players.forEach(id => this.$store.commit('addPlayer', { id }))
    },
    enableEvents: function () {
      this.$store.state.socket.on('currentLive', (data) => this.$store.commit('currentLive', data))

      this.$store.state.socket.on('updateCurrentTime', (data) => {
        let index = null
        this.$store.state.players.forEach((player, pos) => { if (player.id === this.getActiveDeckId) index = pos })
        // let index = this.$store.state.players.findIndex((player) => player.id === data.id)
        this.$store.state.videos[index].currentTime = data.currentTime
      })
      this.$store.state.socket.on('updateRemainingTime', (data) => {
        let index = null
        this.$store.state.players.forEach((player, pos) => { if (player.id === this.getActiveDeckId) index = pos })
        // let index = this.$store.state.players.findIndex((player) => player.id === data.id)
        this.$store.state.videos[index].remainingTime = data.remainingTime
      })

      this.$store.state.socket.on('connect', () => {
        $('#toast-socket').hide()
      })

      this.$store.state.socket.on('disconnect', () => {
        $('#toast-socket').show()
      })
      
      this.$store.state.socket.on('forceUpdate', () => {
        window.location.reload(true)
      })
    }
  },
  created() {
    this.loadData()
  }
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