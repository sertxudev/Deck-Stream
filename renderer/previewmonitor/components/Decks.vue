<template>
  <div>
    <Deck v-for="(id, index) in decksIds" :deck="id" :key="`deck-${index}`"/>
  </div>
</template>

<script>
import Deck from './Deck'

export default {
  components: { Deck },
  computed: {
    decksIds() {
      return this.$store.state.decks
    }
  }
}
</script>
