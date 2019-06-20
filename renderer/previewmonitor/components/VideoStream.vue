<template>
  <video src :id="id" muted @timeupdate="setSync($event)" @play="setSync($event)" width="100%"/>
</template>

<script>
export default {
  props: ['id', 'index', 'preview'],
  mounted() {
    $(this.$el).hide();
  },
  methods: {
    setSync(event) {
      const data = (!this.preview) ? this.$store.state.players[this.index] : this.$store.state.playersPreview[this.index]
      if (!data) return null
      if (this.preview && !data.loop) {
        data.currentTime = event.target.currentTime
        data.remainingTime = event.target.duration - event.target.currentTime
      }

      let time_left = event.target.duration - data.currentTime
      if (time_left > 1 && data.currentTime > 0.001) {
        let time_diff = data.currentTime - event.target.currentTime
        var compensatingFrameRate = ((Math.min(Math.max((time_diff / 2 + 1), 0.33), 3.00))).toFixed(2)
        event.target.playbackRate = compensatingFrameRate
      }
    }
  }
}
</script>
