<template>
    <div>
      <h1>Home</h1>
      <AppUserCard />
      <AppGroupCard />
      <AppServerData />
    </div>
</template>

<script>

import AppUserCard from '@/components/AppUserCard.vue';
import AppGroupCard from '@/components/AppGroupCard.vue';
import AppServerData from "@/components/AppServerData.vue";

export default {
components: { AppUserCard, AppGroupCard, AppServerData },
};
</script>