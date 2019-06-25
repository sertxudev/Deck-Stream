<template>
  <div
    class="card border-0 ui-state-default"
    :id="id"
    v-on:click="setStream(getActiveDeckId, clip)"
    :class="{'live': this.id == getLiveClipId}"
    :style="getStyle"
  >
    <div class="align-items-center card-body d-flex justify-content-center p-0 text-white">
      <small class="mx-1">{{clip.name}}</small>
    </div>
  </div>
</template>

<script>
export default {
  props: ["id", "clip"],
  computed: {
    getActiveDeckId() {
      let data = this.$store.state.data
      return data.decks[data.activeDeck].id;
    },
    getLiveClipId() {
      let index = null
      this.$store.state.players.forEach((player, pos) => { if (player === this.getActiveDeckId) index = pos })
      return this.$store.state.actives[index].clip
    },
    getStyle() {
      if (!this.clip.color) return null
      return `background-color:${this.clip.color}`
    }
  },
  methods: {
    sourceError: function (event) {
      event.target.outerHTML = `
        <div style="height:65px;background: #262626;" class="align-items-center d-flex justify-content-center rounded-top">
          <small class="border border-danger rounded" style="padding: 1px 4px;color: #b3b3b3;">Replace</small>
        </div>`
    },
    setStream: function (id, clip) {
      let url = clip.path.split("#t=").shift()
      this.$store.state.socket.emit('changeSource', { id, clip: this.id, src: url, ...clip })
    },
    setPreload: function (id, clip) {
      let url = clip.path.split("#t=").shift()
    },
    fileIsVideo: function (filename) {
      return filename.split(".").pop().match(/(webm|ogg|mp4)$/i);
    },
    fileIsImage: function (filename) {
      return filename.split(".").pop().match(/(jpg|jpeg|png|gif)$/i);
    }
  }
};
</script>

