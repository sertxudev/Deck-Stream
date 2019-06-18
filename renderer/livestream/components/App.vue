<template>
  <div class="container-fluid h-100 m-0 p-0">
    <BlackOut/>
    <VideoStream id="videoA"/>
    <VideoStream id="videoB"/>
    <ImageStream id="imageA"/>
    <ImageStream id="imageB"/>
  </div>
</template>

<script>
import BlackOut from './BlackOut'
import VideoStream from './VideoStream'
import ImageStream from './ImageStream'

export default {
  components: { BlackOut, VideoStream, ImageStream },
  computed: {
    sourceVideoA() {
      return this.$store.state.player.src;
    }
  }
};
</script>
