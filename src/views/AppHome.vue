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
                    v-if="addData"
                    :orientation="orientation" 
                    :data="addData" />
            </div>
            <div class="right">

            </div>
        </section>
    </div>
</template>

<script>
    import AppHeader from '@/components/AppHeader.vue';
    import AppGroupsAssemble from '@/components/AppGroupsAssemble.vue';
    import AppNavigation from '@/components/AppNavigation.vue';
    import AppAdd from '@/components/AppAdd.vue';
    import { getAdds } from '@/services/add';

    export default {
        components: { AppHeader, AppGroupsAssemble, AppNavigation, AppAdd },
        data() {
            return {
                verticalAddCount: 2,
                addData: null,
                orientation: "vertical"
            }
        },  
        async created() {
            const response = await getAdds(this.verticalAddCount);
            console.log(response, response.adds);
            this.addData = response.adds;
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
        display: flex;
        column-gap: 38px;
        @media (max-width: 1000px) {
            flex-direction: column;
        }
    }
    .left {
        width: 229px;
        display: flex;
        flex-direction: column;
        row-gap: 30px;
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
        justify-content: space-between;
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
</style>