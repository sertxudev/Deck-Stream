<template>
  <div :id="`deck-${id}-preview`" class="position-relative">
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
  props: ['id'],
  created() {
    $(this.$el).height(Math.round(($(this.$el).width() / 16) * 9))
  }
}
</script>
