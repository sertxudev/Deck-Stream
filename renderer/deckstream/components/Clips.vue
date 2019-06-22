<template>
  <draggable class="sortable flex-wrap d-flex w-100" :list="getActiveDeckClips" group="clips">
    <Clip
      :clip="clip"
      v-for="(clip, cIndex) in getActiveDeckClips"
      :key="`clip-${gIndex}-${cIndex}`"
      :id="`clip-${gIndex}-${cIndex}`"
    />
  </draggable>
</template>

<script>
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
  }
};
</script>
