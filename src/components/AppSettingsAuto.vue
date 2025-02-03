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
            <div class="sub_row">
                <span v-if="!social.isNew" class="add">ДОБАВИТЬ</span>
                <span v-else class="add" @click="removeSocial(index)">УДАЛИТЬ</span>
                <img 
                    v-if="!social.isNew"
                    src="@/assets/images/addPlus.png" 
                    @click="addSocial(social, index)"
                >
            </div>
        </div>

        <div v-for="(post, index) in posts" :key="index" class="row2">
            <span>{{ index + 1 }}</span>
            <span>{{ post.title }}</span>
            <img :src="require(`@/assets/images/${post.banner}`)" >
            <a href="#" @click.prevent="downloadImage(post.banner)">Скачать</a>
        </div> 
    </div>
</template>

<script>
import { getUserInfo } from "@/services/user";
import { getPosts } from "@/services/posts";

export default {
    data() {
        return {
            socials: [],
            posts: []
        };
    },
    async created() {
        const response = await getUserInfo(localStorage.getItem("token"));
        
        // Заполняем socials из данных сервера (по умолчанию соцсети без isNew)
        this.socials = [
            { platform: "Вконтакте", link: response.group_link || "", isNew: false },
            { platform: "Instagram", link: response?.social_links?.instagram || "", isNew: false },
            { platform: "Telegram", link: response?.social_links?.telegram || "", isNew: false },
            { platform: "TikTok", link: response?.social_links?.tiktok || "", isNew: false },
            { platform: "WhatsApp", link: response?.social_links?.whatsapp || "", isNew: false },
            { platform: "Facebook", link: response?.social_links?.facebook || "", isNew: false }
        ];

        const posts = await getPosts();
        this.posts = posts;

    },
    methods: {
        addSocial(social, index) {
            this.socials.splice(index + 1, 0, { platform: social.platform, link: "", isNew: true });
        },
        removeSocial(index) {
            this.socials.splice(index, 1);
        },
        downloadImage(imageName) {
            const imageUrl = require(`@/assets/images/${imageName}`);
            const a = document.createElement("a");
            a.href = imageUrl;
            a.download = imageName;
            a.click();
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
        @media (max-width: 600px) {
            width: 70vw;
        }
    }
    .row {
        display: flex;
        column-gap: 20px;
        align-items: center;
        @media (max-width: 600px) {
            flex-direction: column;
            align-items: start;
            row-gap: 15px;
        }
    }
    .sub_row {
        display: flex;
        align-items: center;
        column-gap: 20px;
    }
    img {
        width: 60px;
        height: 62px;
        object-fit: cover;
        object-position: center;
        cursor: pointer;
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
    .row2 {
        display: flex;
        align-items: center;
        justify-content: stretch;
        column-gap: 50px;
        padding: 0px 50px;
        @media (max-width: 800px) {
            column-gap: 30px;
            padding: 0px 20px;
        }
        @media (max-width: 500px) {
            flex-direction: column;
            row-gap: 20px;
        }
    }
    .row2:nth-child(2n) {
        padding: 15px 50px;
        background: #111433;
        @media (max-width: 800px) {
            padding: 15px 20px;
        }
    }
    .row2 span, .row2 a {
        font-size: 14px;
        color: white;
        font-family: 'OpenSans';
        @media (max-width: 600px) {
            font-size: 12px;
        }
    }
    .row2 span {
        @media (max-width: 500px) {
            align-self: start;
            font-size: 15px;
        }
    }
    .row2 span:first-of-type {
        @media (max-width: 500px) {
            align-self: start;
            font-size: 20px;
        }
    }
    a {
        text-decoration: underline;
        cursor: pointer;
        @media (max-width: 500px) {
            align-self: end;
        }
    }
    .row2 img {
        width: 230px;
        @media (max-width: 600px) {
            width: 100px;
            object-fit: cover;
            object-position: center;
        }
        @media (max-width: 500px) {
            width: 100%;
            height: 100px;
            align-self: start;
        }
        
    }
</style>
