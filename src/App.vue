<template>
  <div id="app">
    <router-view></router-view> 
  </div>
</template>


<script>

import { checkUserAuthorization } from './services/auth';

export default {
  // components: { AppStartModal },
  async created() {
        const isAuthorized = await checkUserAuthorization();
        console.log(isAuthorized);
        if (isAuthorized) {
            this.$router.push('/signin');
        } else {
            this.$router.push('/signup');
        }
    }
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
    display: flex;
    justify-content: center;
    align-items: center;
    background: #070A29;
    padding: 50px 0;
  }
</style>