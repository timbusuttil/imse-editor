<template lang="html">
  <nav>
    <h1>Imse ta Vira-ka Os-o</h1>
    <div>
      <router-link to="/">About</router-link>
      <router-link to="Dictionary">Dictionary</router-link>
      <router-link to="Editor">Editor</router-link>
    </div>
  </nav>
</template>

<script>
export default {
}
</script>

<style lang="css" scoped>
nav {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
}

a {
  margin-left: 20px;
}
</style>
