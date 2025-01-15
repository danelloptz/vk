<template>
    <div>
      <h1>Home</h1>
      <AppUserCard />
      <AppGroupCard />
    </div>
</template>

<script>

import AppUserCard from '@/components/AppUserCard.vue';
import AppGroupCard from '@/components/AppGroupCard.vue';

export default {
components: { AppUserCard, AppGroupCard },
};
</script>