<template>
    <section class="analytics" v-if="!nextStep">
        <h2>ИИ анализ ВК: динамика подписчиков, лучшие посты, вовлеченность, лайки, комментарии, репосты.</h2>
        <span>К вашему аккаунту привязана ВК группа: </span>

        <div class="group_card">
            <div class="group_card_item">
                <img :src="userInfo.group.group_photo" >
                <h2>{{ userInfo.group.group_name }}</h2>
            </div>
            <div class="group_card_item">
                <span>{{ userInfo.group?.count_subs_vk }} подписчиков</span>
            </div>
        </div>

        <AppGoodButton :text="text1" class="btn" @click="getStats" />
    </section>
    <section class="analytics" v-if="nextStep">
        <div class="cards">
            <div class="card" v-for="(item, index) in stats" :key="index">
                <span>{{ item.label }}</span>
                <div class="card_item">
                    <h2>{{ item.stat }}</h2>
                    <span>{{ item.difference != "" ? item.difference : "_" }}</span>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    import AppGoodButton from '@/components/AppGoodButton.vue';
    import { getUserInfo } from '@/services/user';

    export default {
        components: { AppGoodButton },
        data() {
            return {
                text1: "АНАЛИЗ ГРУППЫ",
                nextStep: false,
                group: {
                    avatar: "https://sun6-21.vkuserphoto.ru/s/v1/ig2/FAt8r8EAkWLeRrtk0S2TimvC0eigIrH08jSRjF0VccX1b-PHw9QdRO-3RQGvlVWdY0ZXfCy5bR8HtS0bRkvf1DbG.jpg?quality=95&crop=339,132,1065,1065&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720&ava=1&cs=240x240",
                    name: "НАЗВАНИЕ ГРУППЫ 2",
                    subscribes: 700
                },
                stats: [
                    { label: "Охват", stat: "40", difference: "-46%" },
                    { label: "Просмотры", stat: "60", difference: "-28%" },
                    { label: "Подписчики", stat: "0", difference: "" },
                    { label: "Лайки", stat: "7", difference: "" },
                    { label: "Комментарии", stat: "0", difference: "" },
                    { label: "Поделились", stat: "0", difference: "" },
                ],
                userInfo: []
            }
        },
        async created() {
            this.userInfo = await getUserInfo(localStorage.getItem("token"));

        },
        methods: {
            getStats() {
                this.nextStep = true;
            }
        }
    };
</script>

<style scoped>
    .analytics {
        width: 100%;
        display: flex;
        flex-direction: column;
        row-gap: 20px;
    }
    .analytics h2 {
        font-size: 24px;
        font-family: 'OpenSans';
        color: white;
    }
    .analytics span {
        font-size: 18px;
        font-family: 'OpenSans';
        color: white;
    }
    .group_card {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 20px;
        background: #2F3251;
        border-radius: 10px;
    }
    .group_card_item {
        display: flex;
        column-gap: 30px;
        align-items: center;
    }
    .group_card_item img {
        width: 150px;
        height: 150px;
        border-radius: 50%;
        outline: 1px solid white;
        outline-offset: 5px;
    }
    .group_card_item h2, .group_card_item span {
        color: white;
        font-size: 20px;
        font-family: 'OpenSans';
    }
    .btn {
        width: 220px;
        height: 51px;
        align-self: center;
    }

    .cards {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        column-gap: 26px;
        row-gap: 30px;
    }
    .card {
        display: flex;
        flex-direction: column;
        background: #2F3251;
        border-radius: 10px;
        row-gap: 13px;
        width: 100%;
        padding: 17px 44px;
    }
    .card span {
        color: white;
        font-size: 12px;
        font-family: 'OpenSans';
    }
    .card_item {
        display: flex;
        column-gap: 10px;
        align-items: end;
    }
    .card_item h2 {
        font-size: 50px;
        color: white;
        font-family: 'OpenSans';
        line-height: 1;
    }
    .card_item span {
        font-size: 16px;
        color: white;
        font-family: 'OpenSans';
        opacity: .5;
    }
</style>