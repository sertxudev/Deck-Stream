<template>
  <draggable :list="getActiveDeckGroups" group="groups" @end="onEnd" class="groups">
    <Group
      :group="group"
      :gIndex="gIndex"
      v-for="(group, gIndex) in getActiveDeckGroups"
      :key="`group-${gIndex}`"
    />
  </draggable>
</template>

<script>
import { ipcRenderer } from 'electron'
import draggable from "vuedraggable";
import Group from './Group';

export default {
  components: { draggable, Group },
  computed: {
    getActiveDeckGroups() {
      const data = this.$store.state.data
      return data.decks[data.activeDeck].groups
    }
  },
  methods: {
    onEnd() {
      ipcRenderer.send('update-data', this.$store.state.data)
    }
  }
};
</script>

<style>
.groups {
  overflow-y: auto;
  overflow-x: hidden;
  height: calc(100% - 35px);
  padding-left: 15px;
  padding-right: 15px;
}
</style>

