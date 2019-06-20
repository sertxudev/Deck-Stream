<template>
  <div class="stopwatch text-center text-white">{{ getTime }}</div>
</template>

<script>
import { ipcRenderer } from 'electron'

export default {
  data() {
    return {
      count: 0,
      interval: null
    }
  },
  mounted() {
    ipcRenderer.on('stopwatch-start', (event) => {
      if (this.interval) return false
      this.interval = setInterval(() => this.updateClock(), 1000)
    })

    ipcRenderer.on('stopwatch-pause', (event) => {
      if (!this.interval) {
        this.interval = setInterval(() => this.updateClock(), 1000)
      } else {
        clearInterval(this.interval)
        this.interval = null
      }
    })

    ipcRenderer.on('stopwatch-stop', (event) => {
      clearInterval(this.interval)
      this.interval = null
      this.count = 0
    })
  },
  methods: {
    updateClock: function () {
      this.count++
    },
    leadingZero: function (i) {
      if (i < 10) i = "0" + i
      return i
    }
  },
  computed: {
    getTime() {
      var h = Math.floor((this.count / 60 / 60) % 60)
      var m = Math.floor((this.count / 60) % 60)
      var s = Math.floor(this.count % 60)
      h = this.leadingZero(h)
      m = this.leadingZero(m)
      s = this.leadingZero(s)
      return h + ":" + m + ":" + s
    }
  }
}
</script>

<style>
.stopwatch {
  font-size: 3rem;
}
</style>
