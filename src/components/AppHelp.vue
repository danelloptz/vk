<template>
    <section class="help">
        <h1>Для начала посмотрите раздел «Инструкции», здесь есть ответы  на большинство вопросов: </h1>
        <AppGoodButton :text="text1" />
        <span>Также рекомендуем обратиться к вашему рефереру:</span>
        <AppGroupOrUser :objectData="refererData" />
    </section>
    
</template>

<script>
    import AppGoodButton from "@/components/AppGoodButton.vue";
    import AppGroupOrUser from "@/components/AppGroupOrUser.vue";
    import { getUserInfoById } from "@/services/user";

    export default {
        components: { AppGoodButton, AppGroupOrUser },
        data() {
            return {
                text1: "ИНСТРУКЦИИ",
                referData: []
            }
        },
        async created() {
            const refer = await getUserInfoById(842052594, localStorage.getItem("token"));
            this.referData = refer;

            console.log(this.referData);
        }
    };
</script>

<style scoped>

</style>