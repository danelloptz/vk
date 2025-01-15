<template>
    <div>
      <h1>Rotation</h1>
      <AppTabs />
    </div>
</template>

<script>
import AppTabs from '@/components/AppTabs.vue';

export default {
components: { AppTabs },
created() {
    console.log('AppRotation component loaded');
  },
};
</script>

<style>
    h1 {
        color: black;
    }
</style>