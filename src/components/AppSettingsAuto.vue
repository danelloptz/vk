<template>
    <div class="container">
        <h2>Автопродвижение вашего бизнеса Intelektaz</h2>
        <span>Сервис Intelektaz автоматизирует продвижение вашего бизнеса, помогая развивать партнерскую сеть и экономя ваше время.</span>
        <span>Доверьте продвижение в социальных сетях Intelektaz: добавьте нужные социальные сети и группы, и мы ежедневно рандомно будем публиковать продающие посты с вашей реферальной ссылкой.</span>

        <div v-for="(social, index) in socials" :key="index" class="row">
            <input 
                :placeholder="social.platform"
                v-model="social.link"
            >
            <span class="add">ДОБАВИТЬ</span>
            <img src="@/assets/images/addPlus.png" @click="addSocial(index)">
            <!-- <img src="@/assets/images/delete.png" v-if="socials.length > 1" @click="removeSocial(index)" class="delete-icon"> -->
        </div>
    </div>
</template>

<script>
import { getUserInfoLocal } from "@/services/user";  // Подключаем API

export default {
    data() {
        return {
            socials: []
        };
    },
    async created() {
        const response = await getUserInfoLocal();
        
        // Заполняем socials из данных сервера
        this.socials = [
            { platform: "Вконтакте", link: response?.links?.vk || "" },
            { platform: "Instagram", link: response?.links?.instagram || "" },
            { platform: "Telegram", link: response?.links?.telegram || "" },
            { platform: "TikTok", link: response?.links?.tiktok || "" },
            { platform: "WhatsApp", link: response?.links?.whatsapp || "" },
            { platform: "Facebook", link: response?.links?.facebook || "" }
        ];
    },
    methods: {
        addSocial(index) {
            this.socials.splice(index + 1, 0, { platform: "Дополнительно", link: "" });
        },
        removeSocial(index) {
            this.socials.splice(index, 1);
        }
    }
};
</script>

<style scoped>
    .container {
        display: flex;
        flex-direction: column;
        row-gap: 30px;
    }
    h2 {
        font-size: 24px;
        color: white;
        font-family: 'OpenSans';
        font-weight: bold;
    }
    span {
        font-size: 18px;
        color: white;
        font-family: 'OpenSans';
    }
    input {
        width: 360px;
        height: 60px;
        padding: 0 20px;
        box-sizing: border-box;
        font-size: 16px;
        color: rgba(255, 255, 255, 0.5);
        background: none;
        border: 1px solid white;
        border-radius: 10px;
        font-family: 'OpenSans';
        position: relative;
        @media (max-width: 500px) {
            width: 70vw;
        }
    }
    .row {
        display: flex;
        column-gap: 20px;
        align-items: center;
    }
    img {
        width: 60px;
        height: 62px;
        object-fit: cover;
        object-position: center;
    }
    .add {
        font-size: 16px;
        color: white;
        font-family: 'Tektur';
        font-weight: bold;
        padding: 0px 28px;
        background: none;
        border: 1px solid white;
        border-radius: 10px;
        text-align: center;
        align-content: center;
        height: 60px;
        transition: .2s ease-in;
        cursor: pointer;
    }
    .add:hover {
        background: rgba(255, 255, 255, 0.167);
    }
</style>
