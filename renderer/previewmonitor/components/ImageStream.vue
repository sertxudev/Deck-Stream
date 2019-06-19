<template>
  <img src :id="id" height="100%" width="100%">
</template>

<script>
export default {
  props: ['id'],
  mounted() {
    $(this.$el).hide()
  },
  updated() {
    setInterval(() => this.$state.images[payload.id].currentTime++, 1000)
  }
}
</script>
