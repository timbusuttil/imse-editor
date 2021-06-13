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
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  background: #fce4ec;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}

a {
  margin-left: 20px;
}
</style>
