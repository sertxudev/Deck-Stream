<template>
  <div>
    <Player :player="player" v-for="(player) in getPlayers" :key="`player-${player.id}`"/>
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
  }
};
</script>
