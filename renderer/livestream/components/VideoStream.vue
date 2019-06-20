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
      // if (this.$store.state.player.currentTime > 0.001) {
      //   console.log(Math.abs(this.$store.state.player.currentTime - event.target.currentTime))
      //   if (Math.abs(this.$store.state.player.currentTime - event.target.currentTime) > 0.05) {
      //     if (this.$store.state.player.currentTime > event.target.currentTime) {
      //       console.log('--- DESYNC --- hurry up')
      //       event.target.playbackRate = 1.7
      //       // event.target.playbackRate = 2
      //     } else {
      //       console.log('--- DESYNC --- slow down')
      //       event.target.playbackRate = 0.3
      //       // event.target.playbackRate = 0.5
      //     }
      //   } else if (Math.abs(this.$store.state.player.currentTime - event.target.currentTime) > 0.01) {
      //     if (this.$store.state.player.currentTime > event.target.currentTime) {
      //       console.log('--- MICRO DESYNC --- hurry up')
      //       event.target.playbackRate = 1.02
      //     } else {
      //       console.log('--- MICRO DESYNC --- slow down')
      //       event.target.playbackRate = 0.98
      //     }
      //   } else {
      //     event.target.playbackRate = 1
      //   }
      // }

      if (time_left > 1 && this.$store.state.player.currentTime > 0.001) {
        let time_diff = this.$store.state.player.currentTime - event.target.currentTime
        var compensatingFrameRate = ((Math.min(Math.max((time_diff / 2 + 1), 0.33), 3.00))).toFixed(2)
        event.target.playbackRate = compensatingFrameRate
      }

    }
  }
}
</script>
