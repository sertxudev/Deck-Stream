<template>
  <div class="row p-2 group-row">
    <div class="col-12 border-bottom mb-2 pb-1 px-1 text-white">{{ group.name }}</div>
    <Clips :gIndex="gIndex"/>
  </div>
</template>

<script>
import Clips from "./Clips";

export default {
  components: { Clips },
  props: ["group", "gIndex"]
};
</script>
