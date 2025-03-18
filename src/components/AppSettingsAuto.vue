<template>
    <div class="container">
        <div class="row">
            <h2>Автопродвижение вашего бизнеса Intelektaz</h2>
            <div class="switch" 
                @click="switchChange"
                :style="{ background: isAutoposting ? '#7023EC' : 'none' }"    
            >
                <div 
                    class="switch_circle"
                    :style="{ left: isAutoposting ? '0px' : '33.12px' }"    
                ></div>
            </div>
        </div>
        <div class="container">
            <span  >Сервис Intelektaz автоматизирует продвижение вашего бизнеса, помогая развивать партнерскую сеть и экономя ваше время.</span>
            <span  >Доверьте продвижение в социальных сетях Intelektaz: добавьте нужные социальные сети и группы, и мы ежедневно рандомно будем публиковать продающие посты с вашей реферальной ссылкой.</span>

            <div class="social_wrapper" v-if="isAutoposting">
                <div v-for="(social, index) in socials" :key="index" class="row">
                    <input 
                        :placeholder="social.type"
                        v-model="social.link"
                        
                    >
                    <div class="sub_row"  >
                        <span class="add" @click="saveSocial">ДОБАВИТЬ</span>
                        <span v-if="social.isNew" class="add" @click="removeSocial(index)">УДАЛИТЬ</span>
                        <img 
                            v-if="!social.isNew"
                            src="@/assets/images/addPlus.png" 
                            @click="addSocial(social, index)"
                        >
                    </div>
                </div>
            </div>

            <div v-for="(post, index) in posts" :key="index" class="row2">
                <span  >{{ index + 1 }}</span>
                <span  >{{ post.text }}</span>
                <img   :src="post.image" >
                <a   href="#" @click.prevent="downloadImage(post.image)">Скачать</a>
            </div> 
        </div>
        
    </div>
</template>

<script>
import { getUserInfo, sendNewSettings, setAutoposting } from "@/services/user";
import { getPosts } from "@/services/posts";
import { refreshToken } from "@/services/auth";

export default {
    data() {
        return {
            socials: [],
            posts: [],
            userInfo: [],
            isAutoposting: true
        };
    },
    async created() {
        const response = await getUserInfo(localStorage.getItem("token"));
        if (!response) {
            const isAuthorized = await refreshToken(localStorage.getItem("token_refresh"));
            if (isAuthorized) {
                localStorage.setItem("token", isAuthorized.access_token);
                localStorage.setItem("token_refresh", isAuthorized.refresh_token);
            } else {
                localStorage.clear();
                this.$router.push('/');
                return;
            }
        }
        this.userInfo = response;
        this.isAutoposting = this.userInfo.autoposting;
        
        const allSocials = [
            "VK", "Instagram", "Telegram", "TikTok", "Whatsapp", "Facebook"
        ];

        this.socials = allSocials.flatMap(type => {
            // Все соцсети данного типа из userInfo.social_links
            const existing = this.userInfo.social_links.filter(social => social.type === type);

            // Если соцсетей нет, добавляем пустую запись
            if (existing.length === 0) {
                return [{ type, link: "", isNew: false }];
            }

            // Первая соцсеть isNew: false, остальные isNew: true
            return existing.map((social, index) => ({
                type,
                link: social.link,
                isNew: index !== 0
            }));
        });

        const posts = await getPosts();
        this.posts = posts;

    },
    methods: {
        addSocial(social, index) {
            this.socials.splice(index + 1, 0, { type: social.type, link: "", isNew: true });
        },
        removeSocial(index) {
            this.socials.splice(index, 1);
            this.saveSocial();
        },
        downloadImage(imageLink) {
            const imageUrl = imageLink;
            const a = document.createElement("a");
            a.href = imageUrl + '?download';
            a.download = imageLink;
            a.click();
        },
        async saveSocial() {
            const filtered = this.socials.filter(item => item.link != "");
            // Object.values(filtered).forEach(obj => delete obj.isNew);

            this.userInfo.social_links = this.userInfo.social_links.filter(item => {
                return filtered.some(social => social.type === item.type && social.link === item.link);
            });

            filtered.forEach(item => {
                let flag = true;
                this.userInfo.social_links.forEach(social => {
                    if (social.type == item.type && social.link == item.link) flag = false;
                })
                if (flag) this.userInfo.social_links.push(item);
            });

            const payload = {
                country: null,
                city: null,
                sex:  null,
                interests: null,
                social_links: this.userInfo.social_links,
                vip_offer: null,
                group_link: null,
            };

            console.log(payload);
            await sendNewSettings(payload, localStorage.getItem("token")); 
        },
        async switchChange() {
            this.isAutoposting = !this.isAutoposting;
            if (this.isAutoposting) await setAutoposting(this.userInfo.id, true)
            else await setAutoposting(this.userInfo.id, false)
        }
    },
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
    .switch {
        width: 62px;
        height: 27px;
        border-radius: 13.5px;
        outline: 1px solid white;
        outline-offset: 4px;
        position: relative;
        background: #7023EC;
        cursor: pointer;
        transition: .3s ease-in;
    }
    .switch_circle {
        content: "";
        position: absolute;
        left: 0px;
        top: -1px;
        width: 28.88px;
        height: 28.88px;
        border-radius: 50%;
        background: white;
        transition: .3s ease-in;
    }
    .social_wrapper {
        display: flex;
        flex-direction: column;
        row-gap: 30px;
    }
</style>
