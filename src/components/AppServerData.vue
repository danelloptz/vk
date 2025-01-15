<template>
    <div class="server_data">
      <h2>Server Data</h2>
      <div v-if="loading">Loading...</div>
      <div v-else-if="error">Error: {{ error }}</div>
      <ul v-else>
        <img :src="url" width="200px" height="200px">
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    name: "AppServerData",
    data() {
      return {
        data: [],
        url: "",
        loading: true,
        error: null,
      };
    },
    mounted() {
      this.fetchData();
    },
    methods: {
      async fetchData() {
        try {
          const response = await fetch("https://picsum.photos/200");
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          let resp = await response;
          this.url = resp.url;
        } catch (err) {
          this.error = err.message;
        } finally {
          this.loading = false;
        }
      },
    },
  };
  </script>
  
  <style scoped>
  h2 {
    color: #42b983;
  }

  .server_data {
    color: black;
  }
  </style>