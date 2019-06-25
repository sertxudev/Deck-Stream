<template>
  <nav>
    <ul class="nav nav-tabs">
      <draggable class="d-flex" :list="getDecks" group="decks" @end="onDraggedDecks">
        <Deck
          :deck="deck"
          :dIndex="dIndex"
          v-for="(deck, dIndex) in getDecks"
          :key="`deck-${dIndex}`"
        />
      </draggable>

      <!-- <div>
        <button v-on:click="syncDeck()">Sync</button>
      </div>-->
    </ul>
  </nav>
</template>

<script>
import { ipcRenderer } from 'electron'

import draggable from "vuedraggable";
import Deck from "./Deck";

export default {
  components: { draggable, Deck },
  computed: {
    getDecks() {
      return this.$store.state.data.decks
    }
  },
  methods: {
    onDraggedDecks: function(event) {
      this.$store.state.data.activeDeck = event.newIndex;
      ipcRenderer.send('update-data', this.$store.state.data)
    }
  }
};
</script>
