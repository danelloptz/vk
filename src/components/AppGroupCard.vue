<template>
    <div class="group-card">
      <img :src="group.avatar" alt="Group Avatar" />
      <h3>{{ group.name }}</h3>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        group: {
          name: 'Group Name',
          avatar: 'https://via.placeholder.com/100',
        },
      };
    },
  };
  </script>
  
  <style scoped>
  .group-card {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  </style>