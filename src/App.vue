<template>
  <div id="app">
    <Nav />
    <router-view />
  </div>
</template>

<script>
import Nav from '@/components/Nav';

export default {
  components: {
    Nav,
  },
}
</script>

<style>
#app {
  padding: 70px 20px 20px 20px;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
}

html {
  background: #fce4ec;
}
</style>
