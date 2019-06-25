<template>
  <draggable
    class="sortable flex-wrap d-flex w-100"
    :list="getActiveDeckClips"
    group="clips"
    @end="onEnd"
  >
    <Clip
      :clip="clip"
      v-for="(clip, cIndex) in getActiveDeckClips"
      :key="`clip-${gIndex}-${cIndex}`"
      :id="`clip-${gIndex}-${cIndex}`"
    />
  </draggable>
</template>

<script>
import { ipcRenderer } from 'electron'

import draggable from "vuedraggable";
import Clip from "./Clip";

export default {
  components: { draggable, Clip },
  props: ["gIndex"],
  computed: {
    getActiveDeckClips() {
      const data = this.$store.state.data;
      return data.decks[data.activeDeck].groups[this.gIndex].clips;
    }
  },
  methods: {
    onEnd() {
      ipcRenderer.send('update-data', this.$store.state.data)
    }
  }
};
</script>
