<template>
  <audio :src="player.src" controls @timeupdate="onTimeUpdate"></audio>
</template>

<script>
export default {
  props: ["player", "index"],
  methods: {
    clearTimes: function() {
      this.player.currentTime = null;
      this.player.remainingTime = null;
    },
    onTimeUpdate: function() {
      this.player.currentTime = this.$el.currentTime;
      this.player.remainingTime = this.$el.duration - this.$el.currentTime;
    }
  },
  updated() {
    this.clearTimes();
    this.$el.play();
  }
};
</script>
