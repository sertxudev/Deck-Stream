<template>
  <div :id="`deck-${id}-preview`" class="position-relative overflow-hidden">
    <BlackOut/>
    <VideoStream id="videoA" preview="true" :index="id"/>
    <VideoStream id="videoB" preview="true" :index="id"/>
    <ImageStream id="imageA" preview="true" :index="id"/>
    <ImageStream id="imageB" preview="true" :index="id"/>
  </div>
</template>

<script>
import BlackOut from './BlackOut'
import VideoStream from './VideoStream'
import ImageStream from './ImageStream'

export default {
  components: { BlackOut, VideoStream, ImageStream },
  props: ['id'],
  mounted() {
    this.calculateHeight()
    window.addEventListener('resize', (e) => {
      e.preventDefault()
      this.calculateHeight()
    })
  },
  methods: {
    calculateHeight: function () {
      $(this.$el).height(Math.round(($(this.$el).width() / 16) * 9))
    }
  }
}
</script>

<style scoped>
.overflow-hidden {
  overflow: hidden;
}
</style>