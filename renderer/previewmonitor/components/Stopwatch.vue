<template>
  <div class="stopwatch text-center text-white">{{ time }}</div>
</template>

<script>
export default {
  data() {
    return {
      time: null,
      count: 3595
    }
  },
  mounted() {
    this.updateClock()
  },
  methods: {
    updateClock: function () {
      this.count++
      var h = Math.floor((this.count / 60 / 60) % 60)
      var m = Math.floor((this.count / 60) % 60)
      var s = Math.floor(this.count % 60)
      h = this.leadingZero(h)
      m = this.leadingZero(m)
      s = this.leadingZero(s)
      this.time = h + ":" + m + ":" + s
      setTimeout(() => this.updateClock(), 1000)
    },
    leadingZero: function (i) {
      if (i < 10) i = "0" + i
      return i
    }
  }
}
</script>

<style>
.stopwatch {
  font-size: 3rem;
}
</style>
