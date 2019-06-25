<template>
  <div class="container-fluid h-100" id="remotecontrol" v-cloak v-if="this.$store.state.mounted">
    <main>
      <Header/>
      <Groups/>
    </main>
    <Decks/>
    <!-- <Players/> -->
    <div class="toast show" id="toast-socket" role="alert" aria-live="assertive" aria-atomic="true" style="display:none;position:absolute; z-index:10000; top: 5px; right: 5px">
      <div class="toast-header">
        <strong class="mr-auto">Socket.IO</strong>
      </div>
      <div class="toast-body">Connection with the server lost!</div>
    </div>
  </div>
</template>

<script>
import Header from "./Header";
import Groups from "./Groups";
import Decks from "./Decks";
// import Players from "./Players";

export default {
  components: { Header, Groups, Decks },
  // components: { Header, Groups, Decks, Players },
  computed: {
    getData() {
      return this.$store.state.data
    }
  },
  methods: {
    refreshData: function () {
      this.$store.state.socket.emit('refreshData')
    }
  }
};
</script>
