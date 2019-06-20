<template>
  <div class="align-self-center col-6 text-center text-danger">{{ getCurrentTime }}</div>
</template>

<script>
export default {
  props: ["id", "preview"],
  data() {
    return {
      time: 0
    }
  },
  computed: {
    getCurrentTime() {
      const active = (!this.preview) ? this.$store.state.actives[this.id].live : this.$store.state.actives[this.id].preview
      let data = null
      switch (active) {
        case 'video':
          data = (!this.preview) ? this.$store.state.players[this.id] : this.$store.state.playersPreview[this.id]
          break;

        case 'image':
          data = (!this.preview) ? this.$store.state.images[this.id] : this.$store.state.imagesPreview[this.id]
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
