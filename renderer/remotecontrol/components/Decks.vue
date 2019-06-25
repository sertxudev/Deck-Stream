<template>
  <nav>
    <ul class="nav nav-tabs">
      <div class="d-flex">
        <Deck
          :deck="deck"
          :dIndex="dIndex"
          v-for="(deck, dIndex) in getDecks"
          :key="`deck-${dIndex}`"
        />
      </div>
    </ul>
  </nav>
</template>

<script>
import Deck from "./Deck";

export default {
  components: { Deck },
  computed: {
    getDecks() {
      return this.$store.state.data.decks
    }
  },
};
</script>
