<template>
     <AppPopup 
        :visibility1="popupVisible" 
        :vk_id="userData.vk_id"
        :id="userData.id"
        :time="userData.last_gift_time"
        @update:visibility1="popupVisible = $event"
        @close="close" 
        @clicked="takedPoint"
        @error="error"
    />
    <AppModal 
        :title="title" 
        :message="msg" 
        :visibility1="isModal"
        @close="close"
        @update:visibility1="isModal = $event"
    />
    <section class="header">
        <AppModalMini 
            :visibility1="modalUser"
            :windowWidth="windowWidth"
            :userData="userData"
            @update:visibility1="modalUser = $event"
            @isClicked="sendClick"
            @isReffs="openReff"
            @isNews="showNews"
            @isHelp="showHelp"
        />
        <div class="header_title">
            <img src="@/assets/images/main_logo.png" >
            <div class="main_title"></div>
        </div>
        <div class="header_links">
            <a href="" @click.prevent="showNews">Новости</a>
            <a href="" @click.prevent="showHelp">Помощь</a>
        </div>
        <div class="header_user">
            <div class="header_gift" @click="open">
                <img src="@/assets/images/gift.png" >
                <span>{{ points }}%</span>
            </div>
            <div class="header_info" @click="openModalUser">
                <div class="header_info_circle" :class="userData && (userData?.packages[userData?.packages.length - 1]?.package_name !== 'Free' && userData?.packages[userData?.packages.length - 1]?.package_name !== 'Not active' ? 'green' : 'red')"></div>
                <div v-if="userData" class="header_info_status">{{ userData?.packages[userData?.packages.length - 1]?.package_name }}</div>
                <img v-if="userData" :src="userData.avatar_url" >
            </div>
        </div>
    </section>
</template>

<script>
    import AppPopup from '@/components/AppPopup.vue';
    import AppModalMini from '@/components/AppModalMini.vue';
    import AppModal from "@/components/AppModal.vue";

    export default {
        components: { AppPopup, AppModalMini, AppModal },
        props: { 
            userData: Object,
            windowWidth: Number
        },
        data() {
            return {
                popupVisible: false,
                modalUser: false,
                points: 0,
                isModal: false,
            }
        },
        methods: {
            open() {
                this.popupVisible = true;
            },
            close() {
                this.popupVisible = false;
                window.location.reload();
            },
            showHelp() {
                this.$emit('show-help');
            },
            showNews() {
                this.$emit('show-news');
            },
            openModalUser() {
                this.modalUser = true;
            },
            sendClick() {
                this.$emit("isTarif");
            },
            openReff() {
                console.log('header');
                this.$emit("isReff");
            },
            takedPoint() {
                this.points = localStorage.getItem("points");
                this.success();
            },
            success() {
                this.isModal = true;
                this.title = "УСПЕШНО";
                this.msg = `Вы заработали 1 балл. Всего баллов: ${this.points}`;
            },
            error() {
                this.isModal = true;
                this.title = "ОШИБКА";
                this.msg = "Балл можно получить 1 раз в час. \n  Вернитесь позже и повторите попытку."
            }
        },
        async created() {
            console.log(this.windowWidth);
        },
        watch: {
            userData(val) {
                this.points = val.gift_score;
                console.log(val);
            }
        }
    };
</script>

<style scoped>
    @font-face {
        font-family: 'Tektur';
        src: url('@/assets/fonts/Tektur.ttf') format('truetype');
    }
    @font-face {
        font-family: 'OpenSans';
        src: url('@/assets/fonts/OpenSans.ttf') format('truetype');
    }
    .header {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
        z-index: 15;
        padding-top: 10px;
        @media (max-width: 600px) {
            position: static;
        }
    }
    .header_title {
        display: flex;
        align-items: center;
        column-gap: 13px;
        @media (max-width: 650px) {
            column-gap: 6px;
        }
    }
    .header_title img {
        width: 72px;
        height: 72px;
        object-fit: cover;
        object-position: center;
        @media (max-width: 650px) {
            width: 36px;
            height: auto;
        }
    }
    .header_title div {
        width: 174px;
        height: 19px;
        background: url("@/assets/images/main_title.png");
        @media (max-width: 650px) {
            width: 87.24px;
            height: 9.5px;
            background-size: 87.24px 9.5px;
        }
    }
    .header_links {
        display: flex;
        column-gap: 50px;
        @media (max-width: 1000px) {
            column-gap: 20px;
        }
        @media (max-width: 600px) {
            display: none;
        }
    }
    .header_links a {
        font-size: 16px;
        font-family: 'OpenSans';
        color: white;
        text-decoration: none;
    }
    .header_links a:hover {
        text-decoration: underline;
    }
    .header_user {
        display: flex;
        align-items: center;
        column-gap: 77px;
        @media (max-width: 1000px) {
            column-gap: 20px;
        }
    }
    .header_gift {
        display: flex;
        column-gap: 14px;
        align-items: center;
        cursor: pointer;
        @media (max-width: 650px) {
            column-gap: 5px;
        }
    }
    .header_gift img {
        width: 31px;
        height: 31px;
        object-fit: cover;
        object-position: center;
        @media (max-width: 650px) {
            width: 20px;
            height: 20px;
        }
    }
    .header_gift span {
        font-size: 24px;
        font-family: 'OpenSans';
        color: white;
        @media (max-width: 650px) {
            font-size: 16px;
        }
    }
    .header_info {
        display: flex;
        align-items: center;
        column-gap: 10px;
        padding: 4px;
        padding-left: 8px;
        border-radius: 50px;
        border: 1px solid white;
        cursor: pointer;
        @media (max-width: 650px) {
            column-gap: 0px;
        }
    }
    .header_info_circle {
        width: 10px;
        height: 10px;
        border-radius: 5px;
        @media (max-width: 650px) {
            width: 6px;
            height: 6px;
        }
    }
    .green {
        background: #1ABE38;
    }
    .red {
        background: #BE1A20;
        
    }
    .header_info_status {
        font-size: 16px;
        font-family: 'OpenSans';
        color: white;
        @media (max-width: 650px) {
            font-size: 9.23px;
            margin-left: 3px;
            margin-right: 6px;
        }
    }
    .header_info img {
        width: 40px;
        height: 40px;
        border-radius: 20px;
        @media (max-width: 650px) {
            width: 23.08px;
            height: 23.08px;
            border-radius: 50%;
        }
    }
</style>