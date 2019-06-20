<template>
  <audio :src="player.src" controls @timeupdate="onTimeUpdate" :loop="player.loop"></audio>
  <!-- <video :src="player.src" controls @timeupdate="onTimeUpdate"></video> -->
</template>

<script>
import { ipcRenderer } from "electron";

export default {
  props: ["player"],
  methods: {
    clearTimes: function () {
      this.player.currentTime = null;
      this.player.remainingTime = null;
    },
    onTimeUpdate: function () {
      this.$store.commit("updateCurrentTime", { id: this.player.id, currentTime: this.$el.currentTime });

      let remaining = this.$el.duration - this.$el.currentTime
      this.$store.commit("updateRemainingTime", { id: this.player.id, remainingTime: remaining });
    },
  },
  updated() {
    this.clearTimes()
    // console.log('fadeDuration', this.$store.state.data.fadeDuration)
    // setTimeout(() => {
      // ipcRenderer.send('play-video', { deck: this.player.id })
      this.$el.play()
    // }, this.$store.state.data.fadeDuration / 2)
  }
};
</script>
