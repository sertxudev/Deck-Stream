const { ipcRenderer, remote } = require('electron')
const draggable = require('vuedraggable')
const { Menu, MenuItem } = remote

$(document).ready(() => {
  let data = ipcRenderer.sendSync('load-data')

  ipcRenderer.on('console-log', (event, arg) => console.log(arg))

  // Vue.config.devtools = true
  // Vue.config.debug = true;

  Vue.component('draggable', draggable);

  var app = new Vue({
    el: '#deckstream',
    data: data,
    methods: {
      changeDeck: function(index) {
        this.activeDeck = index
      },
      setSteam: function (deck, url) {
        url = url.split('#')[0]
        ipcRenderer.send('enable-stream', { deck, url })
        $('#video-' + deck)[0].src = url
        $('#video-' + deck)[0].play()
        clearTimes()
      },
      setPreload: function (deck, url, event) {
        url = url.split('#')[0]
        ipcRenderer.send('set-preload', { deck, url })
        $('.card.preview').removeClass('preview')
        $(event.target).parent()[0].classList.add('preview')
      },
      syncDeck: function () {
        if (!this.decks[this.activeDeck].outputs.length) return false
        this.decks[this.activeDeck].outputs.forEach((output) => {
          ipcRenderer.sendTo(output, 'time-update', $(`#video-${this.activeDeck}`)[0].currentTime)
        })
      },
      fileIsVideo: function (filename) {
        return filename.split('.').pop().match(/(webm|ogg|mp4)$/i)
      },
      fileIsImage: function (filename) {
        return filename.split('.').pop().match(/(jpg|jpeg|png|gif)$/i)
      },
      onDraggedDecks: function (event) {
        this.activeDeck = event.newIndex
      },
      openContextClip: function (event) {
        let element = $(event.target).parent()[0]
        if (!element.id) element = $(element).parent()[0]

        const menu = new Menu()
        const methods = require('../../context-menu/clips')
        // menu.append(new MenuItem({ label: 'Settings', click: () => methods.openSettings(element) }))
        menu.append(new MenuItem({ label: 'Settings', click: () => ipcRenderer.send('clips-settings', event) }))
        // menu.append(new MenuItem({ label: 'Settings', click: () => { console.log('Settings - Group ' + element.id.split('-')[1] + ' - Clip ' + element.id.split('-')[2]) } }))
        // menu.append(new MenuItem({ label: 'Remove', click: () => { console.log('Remove - Group ' + element.id.split('-')[1] + ' - Clip ' + element.id.split('-')[2]) } }))

        menu.popup({ window: remote.getCurrentWindow() })
      }
    },
    mounted: function () {
      this.decks.forEach((deck, index) => prepareHeader(index))

      ipcRenderer.on('get-data', (event) => ipcRenderer.send('get-data', this.$data))
      ipcRenderer.on('get-name', (event) => ipcRenderer.send('get-name', this.name))
      ipcRenderer.on('get-activeDeck', (event) => ipcRenderer.send('get-activeDeck', { deck: this.decks[this.activeDeck], index: this.activeDeck }))

      ipcRenderer.on('add-output', (event, id) => this.decks[this.activeDeck].outputs.push(id))
      ipcRenderer.on('disable-outputs', (event) => this.decks[this.activeDeck].outputs = [])

      ipcRenderer.on('update-settings', (event, argv) => {
        this.name = argv.name
        this.description = argv.description
      })

      ipcRenderer.on('add-clip', (event, argv) => this.decks[this.activeDeck].groups[argv.group].clips.push({ name: argv.name, path: argv.path, posterTime: 0 }))
      ipcRenderer.on('add-deck', (event, argv) => {
        this.decks.forEach((deck, index) => clearClock(index))
        this.decks.splice(argv.position, 0, { name: argv.name, groups: [] })
        this.decks.forEach((deck, index) => prepareHeader(index))
      })
      ipcRenderer.on('add-group', (event, argv) => this.decks[this.activeDeck].groups.splice(argv.position, 0, { name: argv.name, clips: [] }))
    }
  })

  // document.addEventListener('contextmenu', (event) => {
  //   event.preventDefault()
  //   // let clip = $(event.target).parent()[0]
  //   // console.log(clip)
  //   // aContextMenu.popup(remote.getCurrentWindow())
  //   const { Menu, MenuItem } = remote
  //   const menu = new Menu()
  //   // menu.append(new MenuItem({ label: 'MenuItem1', click() { console.log('item 1 clicked') } }))
  //   // menu.append(new MenuItem({ type: 'separator' }))
  //   // menu.append(new MenuItem({ label: 'MenuItem2', type: 'checkbox', checked: true }))
  //   // const clips = require('../../methods/clips')
  //   // menu.append(new MenuItem({ label: 'New Clip...', click: clips.addNew }))

  //   // menu.popup({ window: remote.getCurrentWindow() })
  // })

// })

function prepareHeader(index) {
  launchClock(index)

  $(`#video-${index}`)[0].ontimeupdate = () => {
    var currentTime = $(`#video-${index}`)[0].currentTime
    if (currentTime) {
      $(`#header-${index} > #currentTime-${index}`)[0].innerText = toHHMMSS(currentTime)

      var remainingTime = $(`#video-${index}`)[0].duration - $(`#video-${index}`)[0].currentTime
      if (remainingTime < 40) $(`#header-${index} > #remainingTime-${index}`)[0].classList.add('flash-time')
      if (remainingTime < 20) $(`#header-${index}`)[0].classList.add('flash-danger')
      $(`#header-${index} > #remainingTime-${index}`)[0].innerText = '-' + toHHMMSS(remainingTime)
    }
  }

  $(`#video-${index}`)[0].onended = () => clearTimes(index)
}

function clearTimes(index) {
  $(`#header-${index} > #remainingTime-${index}`)[0].classList.remove('flash-time')
  $(`#header-${index}`)[0].classList.remove('flash-danger')
  $(`#header-${index} > #currentTime-${index}`)[0].innerText = ''
  $(`#header-${index} > #remainingTime-${index}`)[0].innerText = ''
}

function missingSource() {
  return `
  <div style="height:65px;background: #262626;" class="align-items-center d-flex justify-content-center rounded-top">
    <small class="border border-danger rounded" style="padding: 1px 4px;color: #b3b3b3;">Replace</small>
  </div>`
}

// function setSteam(deck, url) {
//   url = url.split('#')[0]
//   ipcRenderer.send('enable-stream', { deck, url })
//   $('#video')[0].src = url
//   $('#video')[0].play()
//   clearTimes()
// }

// function setPreload(deck, url) {
//   url = url.split('#')[0]
//   ipcRenderer.send('set-preload', { deck, url })
// }

function toHHMMSS(time) {
  var sec_num = parseInt(time, 10);
  var hours = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  var seconds = sec_num - (hours * 3600) - (minutes * 60);

  if (hours < 10) { hours = "0" + hours; }
  if (minutes < 10) { minutes = "0" + minutes; }
  if (seconds < 10) { seconds = "0" + seconds; }
  return hours + ':' + minutes + ':' + seconds;
}

// En el proceso de renderizado (página web).

// console.log(ipcRenderer.sendSync('synchronous-message', 'ping')) // prints "pong"

// ipcRenderer.on('asynchronous-reply', (event, arg) => {
//   console.log(arg) // prints "pong"
// })
// ipcRenderer.send('asynchronous-message', 'ping')