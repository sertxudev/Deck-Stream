<template>
  <div>
    <Group :group="group" :gIndex="gIndex" v-for="(group, gIndex) in getActiveDeckGroups" :key="`group-${gIndex}`"/>
  </div>
</template>

<script>
import Group from './Group';

export default {
  components: { Group },
  computed: {
    getActiveDeckGroups() {
      const data = this.$store.state.data
      return data.decks[data.activeDeck].groups
    }
  }
};
</script>
