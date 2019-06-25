<template>
  <li class="nav-item">
    <a
      :class="{active: dIndex == getActiveDeck}"
      class="nav-link"
      href="#"
      v-on:click="changeDeck(dIndex)"
    >{{deck.name}}</a>
  </li>
</template>

<script>
export default {
  props: ["deck", "dIndex"],
  computed: {
    getActiveDeck() {
      return this.$store.state.data.activeDeck;
    }
  },
  methods: {
    changeDeck: function(index) {
      this.$store.state.data.activeDeck = index;
    }
  }
};
</script>
