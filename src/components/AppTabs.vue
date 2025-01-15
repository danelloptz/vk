<template>
    <div class="tabs">
      <button v-for="tab in tabs" :key="tab" @click="selectTab(tab)" :class="{ active: tab === activeTab }">
        {{ tab }}
      </button>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        tabs: ['Group Rotation', 'Video Rotation', 'Post Rotation'],
        activeTab: 'Group Rotation',
      };
    },
    methods: {
      selectTab(tab) {
        this.activeTab = tab;
      },
    },
  };
  </script>
  
  <style scoped>
  .tabs button {
    margin-right: 0.5rem;
    padding: 0.5rem 1rem;
    border: none;
    background: #333;
    color: white;
    cursor: pointer;
  }
  .tabs button.active {
    background: #555;
  }
  </style>