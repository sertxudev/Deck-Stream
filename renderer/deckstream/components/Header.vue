<template>
  <div class="row bg-dark">
    <Clock/>
    <template v-for="(deck, index) in decks">
      <CurrentTime :key="`currentTime-${index}`" :index="index" v-show="activeDeck == index"/>
      <RemainingTime :key="`remainingTime-${index}`" :index="index" v-show="activeDeck == index"/>
    </template>
  </div>
</template>

<script>
import Clock from "./Clock";
import CurrentTime from "./CurrentTime";
import RemainingTime from "./RemainingTime";

export default {
  components: { Clock, CurrentTime, RemainingTime },
  computed: {
    activeDeck() {
      return this.$store.state.data.activeDeck;
    },
    decks() {
      return this.$store.state.data.decks
    }
  }
};
</script>
