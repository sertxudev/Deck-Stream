<template>
  <audio :src="player.src" controls @timeupdate="onTimeUpdate" :loop="player.loop" class="d-none"></audio>
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
    this.$el.play()
  }
};
</script>
