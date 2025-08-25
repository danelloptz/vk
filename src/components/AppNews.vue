<template>
    <section class="news">
        <div class="header">
            <h1>Новости</h1>
            <span>Информационный Telegram Bot сервиса Intelektaz:</span>
            <AppGoodButton :text="text1" class="btn" @click="redirectBot" />
        </div>
        <hr class="top_hr">
        <div class="item" v-for="(item, index) in news" :key="index">
            <span class="date">{{ formatedDate(item.date_created) }}</span>
            <h2>{{ item.header }}</h2>
            <img :src="item.image" />
            <div class="text" v-html="item.text"></div>
            <hr>
        </div>
    </section>
</template>

<script>
    import AppGoodButton from '@/components/AppGoodButton.vue';
    import { getNews } from '@/services/other';

    export default {
        components: { AppGoodButton },
        data() {
            return {
                text1: " INTELEKTAZ BOT",
                news: []
            }
        },
        async created() {
            const resp = await getNews();
            this.news = resp;
            console.log(this.news);
        },
        methods: {
            formatedDate(time) {
                console.log(time);
                const date = new Date(time);

                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                const hours = String(date.getHours() - 3).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');

                return `— ${day}.${month}.${year} ${hours}:${minutes}`;
            },
            redirectBot() {
                window.open('https://t.me/IntelektazBot', '_blank');
            }
        }
    };
</script>

<style scoped>
    @font-face {
        font-family: 'OpenSans';
        src: url('@/assets/fonts/OpenSans.ttf') format('truetype');
    }
    .news {
        display: flex;
        flex-direction: column;
    }
    .header {
        display: flex;
        flex-direction: column;
        row-gap: 20px;
    }
    .header h1 {
        font-size: 40px;
        color: white;
        font-weight: bold;
        font-family: 'OpenSans';
        @media (max-width: 650px) {
            font-size: 20px;
        }
    }
    .header span {
        color: white;
        font-size: 18px;
        font-family: 'OpenSans';
        @media (max-width: 650px) {
            font-size: 16px;
        }
    }
    hr {
        width: 100%;
        height: 1px;
        background-color: rgba(255, 255, 255, 0.5);
    }
    .top_hr {
        margin-top: 30px;
        margin-bottom: 30px;
    }
    .item {
        display: flex;
        flex-direction: column;
        row-gap: 10px;
    }
    .item h2 {
        font-size: 30px;
        color: white;
        font-weight: bold;
        font-family: 'OpenSans';
        @media (max-width: 650px) {
            font-size: 18px;
        }
    }
    .item img {
        max-height: 300px;
        object-position: left;
        object-fit: contain;
        margin-bottom: 10px;
    }
    .item span {
        color: white;
        font-size: 18px;
        font-family: 'OpenSans';
        @media (max-width: 650px) {
            font-size: 16px;
        }
    }
    .text {
        color: white;
        font-family: 'OpenSans';
        display: flex;
        flex-direction: column;
        row-gap: 10px;
    }
    .date {
        color: rgba(255, 255, 255, 0.5) !important;
    }
    .btn{
        width: 170px;
        height: 51px;
    }
</style>