<template>
  <audio :src="player.src" controls @timeupdate="onTimeUpdate"></audio>
  <!-- <video :src="player.src" controls @timeupdate="onTimeUpdate"></video> -->
</template>

<script>
import { ipcRenderer } from "electron";

export default {
  props: ["player", "index"],
  methods: {
    clearTimes: function () {
      this.player.currentTime = null;
      this.player.remainingTime = null;
    },
    onTimeUpdate: function () {
      this.$store.commit("updateCurrentTime", {
        index: this.index,
        currentTime: this.$el.currentTime
      });
      this.$store.commit("updateRemainingTime", {
        index: this.index,
        remainingTime: this.$el.duration - this.$el.currentTime
      });
    },
  },
  updated() {
    this.clearTimes();
    this.$el.play();
  }
};
</script>
