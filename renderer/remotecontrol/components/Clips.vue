<template>
  <div class="sortable flex-wrap d-flex w-100">
    <Clip
      :clip="clip"
      v-for="(clip, cIndex) in getActiveDeckClips"
      :key="`clip-${gIndex}-${cIndex}`"
      :id="`clip-${gIndex}-${cIndex}`"
    />
  </div>
</template>

<script>
import Clip from "./Clip";

export default {
  components: { Clip },
  props: ["gIndex"],
  computed: {
    getActiveDeckClips() {
      const data = this.$store.state.data;
      return data.decks[data.activeDeck].groups[this.gIndex].clips;
    }
  }
};
</script>
