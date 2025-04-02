<template>
    <div class="container">
        <AppHeader :userData="userInfo" @show-help="updateActiveComponent(7)" @isTarif="openTarif" @isReff="openReff"/>
        <AppGroupsAssemble @comeToAssembly="updateActiveComponent(8)" />
        <section class="content">
            <div class="left">
                <AppNavigation
                    :indexPage="selectedComponent" 
                    :userData="userInfo"
                    @update:indexPage="selectedComponent = $event" 
                    @update-active-index="updateActiveComponent"
                    @update-repeatClick="updateActiveComponent" 
                    @update-isClicked="updateIsClicked"
                />
                <!-- <div class="vip" v-if="vipUser">
                    <div class="vip_user">
                        <img :src="vipUser.avatar">
                        <div class="text_wrapper">
                            <h2>{{ vipUser.name }}</h2>
                            <span>{{ vipUser.package_name }}</span>
                        </div>
                    </div>
                    <span>{{ vipUser.vip_offer_text }}</span>
                    <a :href="vipUser.group_link" target="_blank">Ссылка</a>
                    <div class="vip_footer">
                        <div class="vip_links">
                            <a :href="vkData" target="_blank"><img src="@/assets/images/vk.png"></a>
                            <a :href="tgData.link" target="_blank"><img src="@/assets/images/telegram.png"></a>
                            <a :href="whtData.link" target="_blank"><img src="@/assets/images/whatsapp.png"></a>
                        </div>
                        <span>VIP-предложение</span>
                    </div>
                </div> -->
                <AppVipUser 
                    :vipUser="vipUser"
                    :vkData="vkData"
                    :tgData="tgData"
                    :whtData="whtData"
                    v-if="vipUser" />
                <AppAdd 
                    v-if="addDataVertical"
                    :isClicked="isClicked"
                    @update:isClicked="isClicked = $event" 
                    :orientation="orientation" 
                    :data="addDataVertical" />
            </div>
            <div class="right">
                <AppGroupOrUser 
                    :objectData="businessUser"
                    :isBusiness="true"
                    class="card"
                />
                <AppBalance v-if="selectedComponent === 0 && !isClicked && !isReff" :userData="userInfo" />
                <AppMain v-if="(selectedComponent === 1 && !isClicked) || isReff" :userData="userInfo" :links="isReff" @update-isTarif="openTarif" @update-isRot="openRot" />
                <AppAiGenerator v-if="selectedComponent === 2 && !isClicked && !isReff" :userData="userInfo" @openTariff="openTarif" />
                <AppStructure v-if="selectedComponent === 3 && !isClicked && !isReff" :userData="userInfo" />
                <AppRotation v-if="selectedComponent === 4 && !isClicked && !isReff" :userData="userInfo" :isTarif="isTarif" @update:isTarif="isTarif == $event" @openPlans="openTarif" />
                <AppSettings v-if="selectedComponent === 5 && !isClicked && !isReff" :businessUser="businessUser" />
                <AppFAQ v-if="selectedComponent === 6 && !isClicked && !isReff" />
                <AppBannerAdds v-if="selectedComponent == 10 && !isReff" :userData="userInfo" />
                <AppHelp v-if="selectedComponent === 7 && !isReff" @update-isInstructions="updateActiveComponent(6)" :userData="userInfo" />
                <AppComeToAssembly v-if="selectedComponent === 8 && !isReff" :userData="userInfo" />
                <AppRotationPlans v-if="selectedComponent === 9 && !isReff" :userData="userInfo" /> 
                <AppAdd
                    :isClicked="isClicked" 
                    @update:isClicked="isClicked = $event" 
                    v-if="addDataHorizontal"
                    :orientation="orientationH" 
                    :data="addDataHorizontal"    
                />
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
    import AppRotation from '@/components/AppRotation.vue';
    import AppSettings from '@/components/AppSettings.vue';
    import AppAdd from '@/components/AppAdd.vue';
    import AppFAQ from '@/components/AppFAQ.vue';
    import AppStructure from '@/components/AppStructure.vue';
    import AppBannerAdds from '@/components/AppBannerAdds.vue';
    import AppHelp from '@/components/AppHelp.vue';
    import AppMain from '@/components/AppMain.vue';
    import AppAiGenerator from '@/components/AppAiGenerator.vue';
    import AppComeToAssembly from '@/components/AppComeToAssembly.vue';
    import AppRotationPlans from '@/components/AppRotationPlans.vue';
    import AppVipUser from '@/components/AppVipUser.vue';
    import { getUserInfo, getVipUser } from '@/services/user';
    import { refreshToken } from '@/services/auth';
    import { getOtherAdds } from '@/services/add';

    export default {
        components: { AppHeader, AppGroupsAssemble, AppNavigation, AppAdd, AppGroupOrUser, AppBalance, AppRotation, AppSettings, AppFAQ, AppStructure, AppBannerAdds, AppHelp, AppMain, AppAiGenerator, AppComeToAssembly, AppRotationPlans, AppVipUser },
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
                isBusiness: false,
                selectedComponent: 1,
                selectedPage: "",
                isClicked: false,
                isTarif: false,
                vipUser: [],
                businessUser: [],
                comeToAssembly: false,
                isReff: false,
                tgData: [],
                vkData: [],
                whtData: []
            }
        },  
        computed: {
            currentOrientation() { 
                // это нужно для расположения реклам, которые слева
                return window.innerWidth <= 600 ? 'vertical' : 'horizontal';
            },
        },
        watch: {
            isClicked(newValue) {
                this.selectedComponent = newValue ? 10 : this.selectedComponent;
            }
        },
        async created() {
            let userInfo = await getUserInfo(localStorage.getItem("token"));
            localStorage.setItem("points", userInfo.gift_score);
            console.log(userInfo);
            if (userInfo && !userInfo.activation) {
                this.$router.push('/signup_1');
                return;
            }
            if (!userInfo) {
                const isAuthorized = await refreshToken(localStorage.getItem("token_refresh"));
                console.log("isAuthorized: ", isAuthorized);
                if (isAuthorized) {
                    localStorage.setItem("token", isAuthorized.access_token);
                    localStorage.setItem("token_refresh", isAuthorized.refresh_token);
                    userInfo = await getUserInfo(localStorage.getItem("token"));
                    if (!userInfo) {
                        localStorage.clear();
                        this.$router.push('/');
                        return;
                    }
                    if (userInfo && !userInfo.activation) {
                        this.$router.push('/signup_1');
                        return;
                    }
                } else {
                    localStorage.clear();
                    this.$router.push('/');
                    return;
                }
            }
            this.userInfo = userInfo;

            if (!localStorage.getItem("page")) this.selectedComponent = 1;
            this.selectedComponent = +localStorage.getItem("page");
            console.log(+localStorage.getItem("page"), this.selectedComponent);

            if (["Leader", "Business"].includes(this.userInfo.package_name)) this.isBusiness = true;

            const otherAdds = await getOtherAdds(userInfo.vk_id); // рекламные банеры слева и снизу
            console.log(otherAdds);

            this.addDataVertical = otherAdds.left_ads;
            this.addDataHorizontal = otherAdds.bottom_ads;

            const vip = await getVipUser(this.userInfo.vk_id); // вип юзер слева
            this.vipUser = vip.vip;
            this.businessUser = vip.business;
            this.tgData = this.vipUser?.social_links.filter(link => link.type === "Telegram").at(-1) || [];
            this.whtData = this.vipUser?.social_links.filter(link => link.type === "Whatsapp").at(-1) || [];
            this.vkData = `https://vk.com/id${this.vipUser.vk_id}`;

            console.log(this.vipUser, this.whtData);
            console.log(this.businessUser);

            this.checkWindowWidth();
            window.addEventListener("resize", this.checkWindowWidth);
        },
        beforeUnmount() {
            window.removeEventListener("resize", this.checkWindowWidth);
        },
        methods: {
            checkWindowWidth() {
                // аналогично для блока рекламы надо
                this.orientation = window.innerWidth <= 1000 ? this.orientationH : this.orientationV;
                console.log(this.orientation);
            },
            async updateActiveComponent(index) {
                localStorage.setItem("page", index);
                this.selectedComponent = index;
                const vip = await getVipUser(this.userInfo.vk_id); // вип юзер слева
                this.vipUser = vip.vip;
                this.tgData = this.vipUser?.social_links.filter(link => link.type === "Telegram").at(-1) || [];
                this.whtData = this.vipUser?.social_links.filter(link => link.type === "Whatsapp").at(-1) || [];
                this.vkData = `https://vk.com/id${this.vipUser.vk_id}`;
                this.businessUser = vip.business;
                this.isTarif = false;
                this.isReff = false;
                console.log('СРАБОТАЛО ОБНОВЛЕНИЕ НАВИГАЦИИ');
                if (this.selectedComponent == 4) this.openRot();
            },
            updateIsClicked(flag) {
                // не помню уже для чего, лучше не трогать :)))
                this.isClicked = flag;
            },
            openTarif() {
                // вызываем это, когда где-то захотят открыть Тарифы
                // this.isReff = false;
                // this.isTarif = true;
                console.log("Я ПОСТАВИЛ TRUE!!!!!!");
                this.selectedComponent = 9;
                localStorage.setItem("page", 9);
            },
            openRot() {
                // если откуда-то захотят открыть Ротацию
                this.isReff = false;
                this.isTarif = false;
                this.selectedComponent = 4;
                console.log('ОТКРЫВАЮ РОТАЦИЮ!', this.isTarif);
            },
            openReff() {
                console.log('home open reff');
                this.selectedComponent = 1;
                this.isReff = true;
                this.isTarif = false;
            },
            // changeReff(event) {
            //     this.isReff = event;
            //     console.log(this.isReff);
            // }
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
        padding: 0px 50px;
        display: flex;
        flex-direction: column;
        row-gap: 46px;
        @media (min-width: 1440px) {
            width: 1160px;
            padding: 0;
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
    .vip a {
        word-wrap: break-word;
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
        word-wrap: break-word;
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
    .vip_links a {
        cursor: pointer;
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
        width: 100%;
        background: #2F3251;
        border-radius: 10px;
        padding: 30px 50px;
        @media (max-width: 1500px) {
            width: 100%;
        }
        @media (max-width: 700px) {
            height: auto;
        }
        @media (max-width: 500px) {
            padding: 50px;
        }
    }
</style>