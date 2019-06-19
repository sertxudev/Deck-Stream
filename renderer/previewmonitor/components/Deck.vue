<template>
  <div class="row">
    <div class="col-6">
      <!-- Preview: {{ deck }} -->
      <Preview :id="deck"/>
      <div class="d-flex">
        <CurrentTime :id="deck" preview="true"/>
        <RemainingTime :id="deck" preview="true"/>
      </div>
    </div>
    <div class="col-6">
      <!-- Live: {{ deck }} -->
      <Live :id="deck"/>
      <div class="d-flex">
        <CurrentTime :id="deck"/>
        <RemainingTime :id="deck"/>
      </div>
    </div>
  </div>
</template>

<script>
import Preview from './Preview'
import Live from './Live'
import CurrentTime from './CurrentTime'
import RemainingTime from './RemainingTime'

export default {
  components: { CurrentTime, RemainingTime, Preview, Live },
  props: ['deck']
}
</script>
