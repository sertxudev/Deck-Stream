const { ipcRenderer, remote } = require('electron')

$(document).ready(() => {
  let data = ipcRenderer.sendSync('load-data')

  ipcRenderer.on('console-log', (event, arg) => console.log(arg))

  // Vue.config.devtools = true
  // Vue.config.debug = true;

  var app = new Vue({
    el: '#deckstream',
    data,
    methods: {
      changeDeck: function (index) {
        console.log('Change Desk: ' + index)
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
      }
    },
    mounted: function () {
      this.decks.forEach((deck, index) => {
        launchClock(index)

        $(`#video-${index}`)[0].ontimeupdate = () => {
          var currentTime = $(`#video-${index}`)[0].currentTime
          if (currentTime) {
            $(`#header-${index} > #currentTime`)[0].innerText = toHHMMSS(currentTime)

            var remainingTime = $(`#video-${index}`)[0].duration - $(`#video-${index}`)[0].currentTime
            if (remainingTime < 40) $(`#header-${index} > #remainingTime`)[0].classList.add('flash-time')
            if (remainingTime < 20) $(`#header-${index}`)[0].classList.add('flash-danger')
            $(`#header-${index} > #remainingTime`)[0].innerText = '-' + toHHMMSS(remainingTime)
          }
        }

        $(`#video-${index}`)[0].onended = () => clearTimes(index)
      })

      ipcRenderer.on('get-data', (event) => ipcRenderer.send('get-data', this.$data))
      ipcRenderer.on('get-activeDeck', (event) => ipcRenderer.send('get-activeDeck', this.decks[this.activeDeck]))
      ipcRenderer.on('add-output', (event, id) => this.decks[this.activeDeck].outputs.push(id))
    }
  })

  document.addEventListener('contextmenu', (event) => {
    event.preventDefault()
    let clip = $(event.target).parent()[0]
    console.log(clip)
    // aContextMenu.popup(remote.getCurrentWindow())
  })


})

function clearTimes(index) {
  $(`#header-${index} > #remainingTime`)[0].classList.remove('flash-time')
  $(`#header-${index}`)[0].classList.remove('flash-danger')
  $(`#header-${index} > #currentTime`)[0].innerText = ''
  $(`#header-${index} > #remainingTime`)[0].innerText = ''
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