<template>
    <div class="container">
       
        <AppHeader />
        <AppGroupsAssemble />
    </div>
</template>

<script>
    import AppHeader from '@/components/AppHeader.vue';
    import AppGroupsAssemble from '@/components/AppGroupsAssemble.vue';
    export default {
        components: { AppHeader, AppGroupsAssemble },
        
    };
</script>

<style scoped>
    .container {
        width: 100%;
        padding: 0px 140px;
        @media (max-width: 1200px) {
            padding: 0px 50px;
        }
        @media (max-width: 400px) {
            padding: 0px 25px;
        }
    }
</style>