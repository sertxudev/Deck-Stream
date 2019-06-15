<template>
  <draggable :list="getActiveDeckGroups" group="groups">
    <Group :group="group" :gIndex="gIndex" v-for="(group, gIndex) in getActiveDeckGroups" :key="`group-${gIndex}`"/>
  </draggable>
</template>

<script>
import draggable from "vuedraggable";
import Group from './Group';

export default {
  components: { draggable, Group },
  computed: {
    getActiveDeckGroups() {
      const data = this.$store.state.data
      return data.decks[data.activeDeck].groups
    }
  }
};
</script>
