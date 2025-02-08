<template>
     <AppPopup 
        :visibility1="popupVisible" 
        @update:visibility1="popupVisible = $event"
        @close="close" 
    />
    <section class="header">
        <AppModalMini 
            :visibility1="modalUser"
            :userData="userData"
            @update:visibility1="modalUser = $event"
            @close="close" 
        />
        <div class="header_title">
            <img src="@/assets/images/main_logo.png" >
            <div class="main_title"></div>
        </div>
        <div class="header_links">
            <a href="">Новости</a>
            <a href="" @click.prevent="showHelp">Помощь</a>
        </div>
        <div class="header_user">
            <div class="header_gift" @click="open">
                <img src="@/assets/images/gift.png" >
                <span>33%</span>
            </div>
            <div class="header_info" @click="openModalUser">
                <div class="header_info_circle" :class="userData && (userData.package_name !== 'Free' && userData.package_name !== 'Not active' ? 'green' : 'red')"></div>
                <div v-if="userData" class="header_info_status">{{ userData.package_name }}</div>
                <img v-if="userData" :src="userData.avatar" >
            </div>
        </div>
    </section>
</template>

<script>
    import { getUserInfo  } from '@/services/user';
    import AppPopup from '@/components/AppPopup.vue';
    import AppModalMini from '@/components/AppModalMini.vue';

    export default {
        components: { AppPopup, AppModalMini },
        data() {
            return {
                popupVisible: false,
                modalUser: false,
                userData: null
            }
        },
        methods: {
            open() {
                this.popupVisible = true;
            },
            close() {
                this.popupVisible = false;
            },
            showHelp() {
                this.$emit('show-help');
            },
            openModalUser() {
                this.modalUser = true;
            }
        },
        async created() {
            const response = await getUserInfo(localStorage.getItem("token"));
            this.userData = response;
            console.log(this.userData);

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
    }
    .header_title {
        display: flex;
        align-items: center;
        column-gap: 13px;
    }
    .header_title img {
        width: 72px;
        height: 72px;
        object-fit: cover;
        object-position: center;
        @media (max-width: 350px) {
            width: 50px;
            height: 50px;
        }
    }
    .header_title div {
        width: 174px;
        height: 19px;
        background: url("@/assets/images/main_title.png");
        @media (max-width: 1000px) {
            display: none;
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
    }
    .header_gift img {
        width: 31px;
        height: 31px;
        object-fit: cover;
        object-position: center;
        @media (max-width: 300px) {
            display: none;
        }
    }
    .header_gift span {
        font-size: 24px;
        font-family: 'OpenSans';
        color: white;
        @media (max-width: 650px) {
            display: none;
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
    }
    .header_info_circle {
        width: 10px;
        height: 10px;
        border-radius: 5px;
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
    }
    .header_info img {
        width: 40px;
        height: 40px;
        border-radius: 20px;
        @media (max-width: 350px) {
            width: 30px;
            height: 30px;
        }
    }
</style>