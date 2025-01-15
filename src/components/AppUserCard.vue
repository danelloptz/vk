<template>
    <div class="user-card">
      <img :src="user.avatar" alt="User Avatar" />
      <h2>{{ user.name }}</h2>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        user: {
          name: 'Alexander Tkachenko',
          avatar: 'https://via.placeholder.com/100',
        },
      };
    },
  };
  </script>
  
  <style scoped>
  .user-card {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  </style>