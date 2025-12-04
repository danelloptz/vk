<template>
    <AppModal 
        :title="title" 
        :message="msg" 
        :visibility1="isModal"
        @close="close"
        @update:visibility1="isModal = $event"
    />
    <div class="container">
        <div class="zopaaaaa">
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
                        <span class="add" @click="saveSocial(social.type, social.link)">ДОБАВИТЬ</span>
                        <span v-if="social.isNew" class="add" @click="removeSocial(index)">УДАЛИТЬ</span>
                        <img 
                            v-if="!social.isNew && social.type != 'Telegram'"
                            src="@/assets/images/addPlus.png" 
                            @click="addSocial(social, index)"
                        >
                    </div>
                </div>
            </div>
            <div class="row">
                <AppGoodButton class="drop_btn" :text="'ВЫГРУЗИТЬ ТГ'" @click="hahahaha" />
                <AppGoodButton class="drop_btn" :text="'ВЫГРУЗИТЬ ВК'" @click="dropPosts" />
            </div>
            
            <div v-for="(post, index) in paginatedPosts" :key="index" class="row2">
                <span  >{{ (index + 1) + (currentPage - 1)*pageSize }}</span>
                <span  >Пост: <br>{{ post.text || post.post_text[post.chose_post_index] }}</span>
                <img   :src="post.image || post.image_links[post.chose_image_index]" >
                <a   href="#" @click.prevent="downloadImage(post.image || post.image_links[post.chose_image_index])">Скачать</a>
            </div> 
        </div>

        <div class="switchs" v-if="totalPages > 1">
            <img src="@/assets/images/arrow.svg" @click="prevPage" style="transform: rotate(180deg);" v-if="currentPage > 1" />

            <span v-for="page in visiblePages" :key="page" @click="goToPage(page)" 
                  :class="{ active: page === currentPage }">
                {{ page }}
            </span>

            <span v-if="currentPage + 2 < totalPages">...</span>

            <img src="@/assets/images/arrow.svg" @click="nextPage" v-if="currentPage < totalPages" />
        </div>
        <span>*Соцсеть принадлежит компании Meta, признанной экстремистской в РФ</span>
    </div>
</template>

<script>
import { getUserInfo, sendNewSettings, setAutoposting, sendPosts } from "@/services/user";
import { getPosts } from "@/services/posts";
import AppGoodButton from '@/components/AppGoodButton.vue';
import AppModal from '@/components/AppModal.vue';
import { addPromotionChannel } from '@/services/tg';

export default {
    components: { AppGoodButton, AppModal },
    data() {
        return {
            socials: [],
            posts: [],
            userInfo: [],
            isAutoposting: true,
            currentPage: 1, // Текущая страница
            pageSize: 5, // Количество постов на странице
            text: "ВЫГРУЗИТЬ",
            isModal: false,
            title: "",
            msg: ""
        };
    },
    computed: {
        totalPages() {
            return Math.ceil(this.posts.length / this.pageSize);
        },
        visiblePages() {
            const pages = [];
            for (
                let i = Math.max(1, this.currentPage - 2);
                i <= Math.min(this.totalPages, this.currentPage + 2);
                i++
            ) {
                pages.push(i);
            }
            return pages;
        },
        paginatedPosts() {
            const start = (this.currentPage - 1) * this.pageSize;
            const end = start + this.pageSize;
            return this.posts.slice(start, end);
        },
    },
    async created() {
        const response = await getUserInfo(localStorage.getItem("token"));
        if (!response) {
            localStorage.clear();
            this.$router.push('/');
            return;
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

        this.posts = await getPosts();
    },
    methods: {
        hahahaha() {
            this.title = "УСПЕШНО!";
            this.msg = "Посты для автопродвижения были успешно выгруженны в ваш телеграмм канал.";
            this.isModal = true;
        },
        async dropPosts() {
            try {
                const resp = await sendPosts(localStorage.getItem("token"));
                if (!resp || !resp.status) {
                    console.error("ошибка выгрузки!");
                    return;
                }
                this.title = "УСПЕШНО!";
                this.msg = "Посты для автопродвижения были успешно выгруженны на вашу страницу. Вы сможете найти их в разделе 'Отложенные посты'. ";
                this.isModal = true;
            } catch(error) {
                console.error(error);
                this.title = "ОШИБКА!";
                this.msg = "При выгрузке постов произошла ошибка. Перезагрузите страницу и попробуйте ещё раз.";
                this.isModal = true;
            }
        },
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
        async saveSocial(social_type, link) {
            if (social_type == 'Telegram') {
                await addPromotionChannel(link, localStorage.getItem('token'));
            }
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
        },
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
            }
        },
        goToPage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
            }
        },
    },
};
</script>

<style scoped>
    .drop_btn {
        width: 230px;
        height: 40px;
    }
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
        @media (max-width: 650px) {
            font-size: 16px;
            width: fit-content;
        }
    }
    span {
        font-size: 18px;
        color: white;
        font-family: 'OpenSans';
        @media (max-width: 650px) {
            font-size: 14px;
        }
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
        @media (max-width: 650px) {
            width: 100%;
            height: 50px;
        }
    }
    .row {
        display: flex;
        column-gap: 20px;
        align-items: center;
        @media (max-width: 650px) {
            flex-direction: column !important;
            row-gap: 15px !important;
        }
    }
    .zopaaaaa {
        display: flex;
        column-gap: 15px;
        align-items: center;
        position: relative;
    }
    .sub_row {
        display: flex;
        align-items: center;
        column-gap: 20px;
        @media (max-width: 650px) {
            column-gap: 15px;
        }
    }
    img {
        width: 60px;
        height: 62px;
        object-fit: cover;
        object-position: center;
        cursor: pointer;
        @media (max-width: 650px) {
            width: 39px;
            height: auto;
        }
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
        @media (max-width: 650px) {
            padding: 12px 28px;
            height: 41px;
        }
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
    }
    .row2 span {
        @media (max-width: 6500px) {
            align-self: start;
            font-size: 14px;
        }
    }
    /* .row2 span:first-of-type {
        @media (max-width: 500px) {
            align-self: start;
            font-size: 20px;
        }
    } */
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
        .switchs {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 20px;
        gap: 10px;
    }
    .switchs img {
        cursor: pointer;
        width: 15px;
        filter: invert(100%);
        width: 15px;
        height: 15px;
    }
    .switchs span {
        cursor: pointer;
        font-size: 16px;
        padding: 5px 10px;
        border-radius: 5px;
        color: white;
    }
    .switchs span.active {
        background-color: #111433;
        color: white;
    }
a {
    color: white;
    font-family: 'OpenSans';
}
</style>