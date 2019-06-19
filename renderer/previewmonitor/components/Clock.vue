<template>
  <div class="clock text-center text-white">{{ time }}</div>
</template>

<script>
export default {
  data() {
    return {
      time: null
    }
  },
  mounted() {
    this.updateClock()
  },
  methods: {
    updateClock: function () {
      var today = new Date()
      var h = this.leadingZero(today.getHours())
      var m = this.leadingZero(today.getMinutes())
      var s = this.leadingZero(today.getSeconds())
      this.time = h + ":" + m + ":" + s
      setTimeout(() => this.updateClock(), 500)
    },
    leadingZero: function (i) {
      if (i < 10) i = "0" + i
      return i
    }
  }
}
</script>

<style>
.clock {
  font-size: 3rem;
}
</style>
