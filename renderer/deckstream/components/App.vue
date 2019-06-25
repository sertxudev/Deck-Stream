<template>
  <div class="container-fluid h-100 p-0" id="deckstream" v-cloak>
    <main>
      <Header/>
      <Groups/>
    </main>
    <Decks/>
    <Players/>
  </div>
</template>

<script>
import Header from "./Header";
import Groups from "./Groups";
import Decks from "./Decks";
import Players from "./Players";

export default {
  components: { Header, Groups, Decks, Players }
};
</script>
