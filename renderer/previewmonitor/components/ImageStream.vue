<template>
  <img src :id="id" height="100%" width="100%">
</template>

<script>
export default {
  props: ['id', 'index', 'preview'],
  data() {
    return {
      interval: null
    }
  },
  mounted() {
    $(this.$el).hide()
  }
}
</script>
