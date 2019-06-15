<template>
  <div>
    <Player
      :player="player"
      :index="index"
      v-for="(player, index) in getPlayers"
      :key="`player-${index}`"
    />
  </div>
</template>

<script>
import Player from "./Player";

export default {
  components: { Player },
  computed: {
    getPlayers() {
      return this.$store.state.players;
    }
  },
  updated() {
    console.log('--------- players updated ---------')
  }
};
</script>
