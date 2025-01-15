<template>
  <div id="app">
    <header>
      <nav>
        <button @click="$router.push('/')">Home</button>
        <button @click="$router.push('/rotation')">Rotation</button>
        <button @click="$router.push('/settings')">Settings</button>
      </nav>
    </header>
    <router-view></router-view> 
  </div>
</template>


<script>
export default {
};
</script>


<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
nav {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}
nav a {
  text-decoration: none;
  color: black;
}
nav a.router-link-exact-active {
  font-weight: bold;
  text-decoration: underline;
}
</style>