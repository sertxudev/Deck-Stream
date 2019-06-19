<template>
  <div class="container-fluid">
    <Decks/>
    <div class="row">
      <div class="col-6">
        <Clock/>
      </div>
      <div class="col-6">
        <Stopwatch/>
      </div>
    </div>
  </div>
</template>

<script>
import Decks from './Decks'
import Clock from './Clock'
import Stopwatch from './Stopwatch'

export default {
  components: { Decks, Clock, Stopwatch }
}
</script>
