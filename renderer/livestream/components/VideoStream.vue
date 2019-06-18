<template>
  <video src :id="id" muted @timeupdate="setSync($event)" @play="setSync($event)"/>
</template>

<script>
export default {
  props: ['id'],
  mounted() {
    $(this.$el).hide();
  },
  methods: {
    setSync(event) {
      let time_left = event.target.duration - this.$store.state.player.currentTime
      if (this.$store.state.player.currentTime > 0.001) {
        if (Math.abs(this.$store.state.player.currentTime - event.target.currentTime) > 0.05) {
          if (this.$store.state.player.currentTime > event.target.currentTime) {
            event.target.playbackRate = 1.3
          } else {
            event.target.playbackRate = 0.7
          }
        } else if (Math.abs(this.$store.state.player.currentTime - event.target.currentTime) > 0.01) {
          if (this.$store.state.player.currentTime > event.target.currentTime) {
            event.target.playbackRate = 1.02
          } else {
            event.target.playbackRate = 0.98
          }
        } else {
          event.target.playbackRate = 1
        }
      }
    }
  }
}
</script>
