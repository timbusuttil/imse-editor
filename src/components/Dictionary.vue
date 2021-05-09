<template lang="html">
  <pre class="">
    {{ vocabulary }}
  </pre>
</template>

<script>
import vocabulary from '@/vocabulary.json';

export default {
  data() {
    return {
      vocabulary: vocabulary,
    }
  }
}
</script>

<style lang="css" scoped>
</style>
