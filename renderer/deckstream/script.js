import { ipcRenderer, remote } from 'electron'
const { Menu, MenuItem } = remote

import Vue from 'vue'
import Vuex from 'vuex'
import sharedMutations from 'vuex-shared-mutations';

import App from './components/App.vue'

import 'bootstrap/dist/css/bootstrap.min.css'
import './style.css'

import $ from 'jquery'
import Popper from 'popper.js'
import 'bootstrap'
import draggable from 'vuedraggable'

window.$ = $
$(() => $('[data-toggle="tooltip"]').tooltip())
Popper.Defaults.modifiers.computeStyle.gpuAcceleration = !(window.devicePixelRatio < 1.5 && /Win/.test(navigator.platform))

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    players: [],
    data: {}
  },
  mutations: {
    changeSource(state, payload) {
      state.players[payload.index].src = ''
      state.players[payload.index].src = payload.src
    },
    changePreviewSource(state, payload) {
      state.players[payload.index].previewSrc = payload.src
    },
    updateCurrentTime(state, payload) {
      state.players[payload.index].currentTime = payload.currentTime
    },
    updateRemainingTime(state, payload) {
      state.players[payload.index].remainingTime = payload.remainingTime
    }
  },
  plugins: [sharedMutations({ predicate: ['changeSource', 'updateCurrentTime'] })]
})

new Vue({
  components: { App },
  store,
  template: '<App ref="app"></App>',
  methods: {
    loadData: function () {
      let data = ipcRenderer.sendSync('load-data')
      this.$store.state.data = data
    },
    buildPlayers: function () {
      const decks = this.$store.state.data.decks
      decks.forEach((deck, index) => {
        this.$store.state.players.splice(index, 0, { src: "", currentTime: null, remainingTime: null })
      })
    },
    enableEvents: function () {
      const data = this.$store.state.data

      ipcRenderer.on('get-data', (event) => ipcRenderer.send('get-data', data))
      ipcRenderer.on('get-name', (event) => ipcRenderer.send('get-name', data.name))
      ipcRenderer.on('get-activeDeck', (event) => ipcRenderer.send('get-activeDeck', { deck: data.decks[data.activeDeck], index: data.activeDeck }))

      ipcRenderer.on('add-output', (event, id) => data.decks[data.activeDeck].outputs.push(id))
      ipcRenderer.on('disable-outputs', (event) => data.decks[data.activeDeck].outputs = [])

      ipcRenderer.on('update-settings', (event, argv) => {
        data.name = argv.name
        data.description = argv.description
      })

      ipcRenderer.on('add-clip', (event, argv) => {
        data.decks[data.activeDeck].groups[argv.group].clips.push({ name: argv.name, path: argv.path, posterTime: 0 })
      })
      ipcRenderer.on('add-deck', (event, argv) => {
        data.decks.forEach((deck, index) => clearClock(index))
        data.decks.splice(argv.position, 0, { name: argv.name, groups: [] })
        data.decks.forEach((deck, index) => prepareHeader(index))
      })
      ipcRenderer.on('add-group', (event, argv) => data.decks[data.activeDeck].groups.splice(argv.position, 0, { name: argv.name, clips: [] }))
    }
  },
  created() {
    this.loadData()
    this.enableEvents()
    this.buildPlayers()
  }
}).$mount('#app')