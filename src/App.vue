<template>
  <div id="app">
    <AppStartModal />
    <router-view></router-view> 
  </div>
</template>


<script>
import AppStartModal from './views/AppStartModal.vue';
export default {
  components: { AppStartModal }
};
</script>


<style>
  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }
  #app {
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #070A29;
  }
</style>