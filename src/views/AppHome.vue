<template>
    <div class="container">
       
        <AppHeader />
        <AppGroupsAssemble />
        <section class="content">
            <div class="left">
                <AppNavigation />
                <div class="vip">
                    <div class="vip_user">
                        <img src="@/assets/images/avatar.jpg">
                        <div class="text_wrapper">
                            <h2>Василенко Данил</h2>
                            <span>VIP</span>
                        </div>
                    </div>
                    <span>Здесь написано какое-то вип-предложение</span>
                    <a href="https://vk.com/profcom.petrsu">Ссылка</a>
                    <div class="vip_footer">
                        <div class="vip_links">
                            <img src="@/assets/images/vk.png">
                            <img src="@/assets/images/telegram.png">
                            <img src="@/assets/images/whatsapp.png">
                        </div>
                        <span>VIP-предложение</span>
                    </div>
                </div>
                <AppAdd 
                    v-if="addDataVertical"
                    :orientation="orientation" 
                    :data="addDataVertical" />
            </div>
            <div class="right">
                <AppGroupOrUser 
                    :objectData="userInfo"
                    :isBusiness="isBusiness"
                    class="card"
                />
                <AppBalance />
                <AppAdd 
                    v-if="addDataHorizontal"
                    :orientation="orientationH" 
                    :data="addDataHorizontal" />
            </div>
        </section>
    </div>
</template>

<script>
    import AppHeader from '@/components/AppHeader.vue';
    import AppGroupsAssemble from '@/components/AppGroupsAssemble.vue';
    import AppGroupOrUser from '@/components/AppGroupOrUser.vue';
    import AppNavigation from '@/components/AppNavigation.vue';
    import AppBalance from '@/components/AppBalance.vue';
    import AppAdd from '@/components/AppAdd.vue';
    import { getAdds } from '@/services/add';
    import { getUserInfoLocal } from '@/services/user';

    export default {
        components: { AppHeader, AppGroupsAssemble, AppNavigation, AppAdd, AppGroupOrUser, AppBalance },
        data() {
            return {
                verticalAddCount: 2,
                horizontalCount: 1,
                addDataVertical: null,
                addDataHorizontal: null,
                orientationV: "vertical",
                orientationH: "horizontal",
                orientation: "vertical",
                userInfo: null,
                isMobileView: false,
                isBusiness: true
            }
        },  
        computed: {
            currentOrientation() {
                return window.innerWidth <= 600 ? 'vertical' : 'horizontal';
            }
        },
        async created() {
            const responseV = await getAdds(this.verticalAddCount);
            this.addDataVertical = responseV.adds;
            const responseH = await getAdds(this.horizontalCount);
            this.addDataHorizontal = responseH.adds;
            
            const userInfo = await getUserInfoLocal();
            this.userInfo = userInfo;

            this.checkWindowWidth();
            window.addEventListener("resize", this.checkWindowWidth);
        },
        beforeUnmount() {
            window.removeEventListener("resize", this.checkWindowWidth);
        },
        methods: {
            checkWindowWidth() {
                this.orientation = window.innerWidth <= 1000 ? this.orientationH : this.orientationV;
                console.log(this.orientation);
            },
        },
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
    span, a {
        font-size: 14px;
        color: white;
        font-family: 'OpenSans';
    }
    a { text-decoration: underline; }
    .container {
        width: 100%;
        padding: 0px 140px;
        display: flex;
        flex-direction: column;
        row-gap: 46px;
        @media (max-width: 1200px) {
            padding: 0px 50px;
        }
        @media (max-width: 400px) {
            padding: 0px 25px;
        }
    }
    .content {
        width: 100%;
        display: flex;
        column-gap: 38px;
        row-gap: 30px;
        @media (max-width: 1000px) {
            flex-direction: column;
        }
    }
    .left {
        width: 229px;
        display: flex;
        flex-direction: column;
        row-gap: 30px;
        @media (max-width: 1000px) {
            display: grid;
            grid-template-columns: 1fr 2fr;
            width: 100%;
            column-gap: 20px;
        }
        @media (max-width: 800px) {
            grid-template-columns: 2fr 3fr;
        }
        @media (max-width: 600px) {
            grid-template-columns: 1fr;
        }
    }
    .right {
        width: 100%;
        display: flex;
        flex-direction: column;
        row-gap: 35px;
    }

    .vip {
        width: 100%;
        background: #2F3251;
        padding: 10px;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        row-gap: 10px;
    }
    .vip_user {
        display: flex;
        align-items: center;
        column-gap: 20px;
    }
    .vip_user img {
        width: 60px;
        height: 60px;
        border-radius: 30px;
        object-position: center;
    }
    .text_wrapper {
        display: flex;
        flex-direction: column;
        row-gap: 5px;
    }
    .text_wrapper h2 {
        color: white;
        font-size: 16px;
        font-family: 'OpenSans';
        font-weight: normal;
    }
    .text_wrapper span {
        color: white;
        font-size: 14px;
        font-weight: bold;
        font-family: 'OpenSans';
        padding: 1px 10px;
        background: #7023EC;
        border-radius: 5px;
        width: max-content;
    }
    .vip_footer {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .vip_links {
        display: flex;
        align-items: center;
        column-gap: 10px;
    }
    .vip_links img {
        width: 15px;
        height: 15px;
    }
    .vip_footer span {
        color: #23EC63;
        font-size: 10px;
        font-weight: 500;
        font-family: 'OpenSans';
    }

    .card {
        height: 276px;
        background: #2F3251;
        border-radius: 10px;
        padding: 30px 50px;
        @media (max-width: 700px) {
            height: auto;
        }
        @media (max-width: 500px) {
            padding: 50px;
        }
    }
</style>