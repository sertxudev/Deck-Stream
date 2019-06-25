<template>
  <div class="align-self-center col-6 text-center text-success current-time">{{ getCurrentTime }}</div>
</template>

<script>
export default {
  props: ["index", "preview"],
  data() {
    return {
      time: 0
    }
  },
  computed: {
    getCurrentTime() {
      const active = this.$store.state.actives[this.index].live
      let data = null
      switch (active) {
        case 'video':
          data = this.$store.state.videos[this.index]
          break;

        case 'image':
          data = this.$store.state.images[this.index]
          break;

        default:
          return this.toHHMMSS()
          break;
      }

      if (!data) return null

      return this.toHHMMSS(data.currentTime)
    }
  },
  methods: {
    toHHMMSS: function (time) {
      var sec_num = parseInt(time, 10)
      var hours = Math.floor(sec_num / 3600)
      var minutes = Math.floor((sec_num - hours * 3600) / 60)
      var seconds = sec_num - hours * 3600 - minutes * 60

      if (hours < 10) hours = "0" + hours
      if (minutes < 10) minutes = "0" + minutes
      if (seconds < 10) seconds = "0" + seconds
      return hours + ":" + minutes + ":" + seconds
    }
  }
}
</script>

<style>
.current-time {
  font-size: 25px;
  padding: 10px 0px 5px;
}
</style>
