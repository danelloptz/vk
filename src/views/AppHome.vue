<template>
    <div class="container">
        <AppHeader :userData="userInfo" @show-news="updateActiveComponent(11)" @show-help="updateActiveComponent(7)" @isTarif="openTarif" @isReff="openReff"/>
        <AppGroupsAssemble @comeToAssembly="updateActiveComponent(8)" />
        <section class="content">
            <div class="left">
                <AppNavigation
                    v-if="windowWidth > 1200"
                    :indexPage="selectedComponent" 
                    :userData="userInfo"
                    @update:indexPage="selectedComponent = $event" 
                    @update-active-index="updateActiveComponent"
                    @update-repeatClick="updateActiveComponent" 
                    @update-isClicked="updateIsClicked"
                />
                <AppVipUser 
                    :vipUser="vipUser"
                    :vkData="vkData"
                    :tgData="tgData"
                    :whtData="whtData"
                    :windowWidth="windowWidth"
                    v-if="vipUser" />
                <AppAdd 
                    v-if="addDataVertical"
                    :isClicked="isClicked"
                    @update:isClicked="isClicked = $event" 
                    :orientation="windowWidth <= 650 ? orientationV : orientation" 
                    :data="addDataVertical" />
                <AppGroupOrUser 
                    v-if="windowWidth <= 650"
                    :objectData="businessUser"
                    :isBusiness="true"
                    class="card"
                />
            </div>
            <div class="right">
                <AppGroupOrUser 
                    v-if="windowWidth > 650"
                    :objectData="businessUser"
                    :isBusiness="true"
                    class="card"
                />
                <AppBalance v-if="selectedComponent === 0 && !isClicked && !isReff" :userData="userInfo" :windowWidth="windowWidth" />
                <AppMain v-if="(selectedComponent === 1 && !isClicked) || isReff" :userData="userInfo" :links="isReff" @update-isTarif="openTarif" @update-isRot="openRot" />
                <AppAiGenerator v-if="selectedComponent === 2 && !isClicked && !isReff" :userData="userInfo" @openTariff="openTarif" />
                <AppStructure v-if="selectedComponent === 3 && !isClicked && !isReff" :userData="userInfo" :windowWidth="windowWidth" />
                <AppRotation v-if="selectedComponent === 4 && !isClicked && !isReff" :userData="userInfo" :windowWidth="windowWidth" :isTarif="isTarif" @update:isTarif="isTarif == $event" @openPlans="openTarif" />
                <AppSettings v-if="selectedComponent === 5 && !isClicked && !isReff" :windowWidth="windowWidth" :businessUser="businessUser" />
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
                <AppNews v-if="selectedComponent === 11 && !isReff" />
            </div>
        </section>
        <section class="wrapper_nav_mobile" v-if="windowWidth <= 1200">
            <div class="nav_mobile" v-if="isBurger">
                <div 
                    class="item" 
                    v-for="(menu, index) in updatedMenuItems" 
                    :key="index" 
                    :class="{ active: selectedComponent === index }" 
                    @click="updateActiveComponent(index)"
                >
                    <img :src="menu.img" />
                    <span>{{ menu.label }}</span>
                </div>
            </div>
            <div class="footer">
                <div class="burger" v-if="!isBurger" @click="openBurger">
                    <img src="@/assets/images/burger.png">
                    <span>Меню</span>
                </div>
                <img src="@/assets/images/close.png" class="burger_close" @click="closeBurger" v-if="isBurger" >
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
    import AppNews from '@/components/AppNews.vue';
    import { getUserInfo, getVipUser } from '@/services/user';
    import { refreshToken } from '@/services/auth';
    import { getOtherAdds } from '@/services/add';

    export default {
        components: { AppHeader, AppGroupsAssemble, AppNavigation, AppAdd, AppGroupOrUser, AppBalance, AppRotation, AppSettings, AppFAQ, AppStructure, AppBannerAdds, AppHelp, AppMain, AppAiGenerator, AppComeToAssembly, AppRotationPlans, AppVipUser, AppNews },
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
                whtData: [],
                windowWidth: 0,
                menuItems: [
                    { img: require('@/assets/images/balance.png'), label: 'Баланс: ' },
                    { img: require('@/assets/images/home.png'), label: 'Главная' },
                    { img: require('@/assets/images/Ai.png'), label: 'ИИ генератор' },
                    { img: require('@/assets/images/structure.png'), label: 'Структура' },
                    { img: require('@/assets/images/rotation.png'), label: 'Ротация' },
                    { img: require('@/assets/images/settings.png'), label: 'Настройки' },
                    { img: require('@/assets/images/instructions.png'), label: 'Инструкции' },
                ],
                isBurger: false,
                helpFlag: false
            }
        },  
        mounted() {
            this.windowWidth = window.innerWidth;

            window.addEventListener('resize', this.handleResize);
        },
        computed: {
            currentOrientation() { 
                // это нужно для расположения реклам, которые слева
                return window.innerWidth <= 600 ? 'vertical' : 'horizontal';
            },
            updatedMenuItems() {
                return this.menuItems.map((item, index) => {
                    if (index === 0 && this.userInfo) {
                        return { ...item, label: `Баланс: ${this.userInfo.balance} USDT` };
                    }
                    return item;
                });
            }
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
            openBurger() {
                document.addEventListener("click", this.handleClickOutside);
                this.isBurger = true;
            },
            closeBurger() {
                this.isBurger = false;
                document.removeEventListener("click", this.handleClickOutside);
            },
            handleClickOutside(event) {
                const path = event.composedPath();
                const wrapperNavMobile = this.$el.querySelector(".wrapper_nav_mobile");
                console.log(!path.includes(wrapperNavMobile), this.helpFlag);
                if (!path.includes(wrapperNavMobile) && this.helpFlag) {
                    this.closeBurger();
                    this.helpFlag = false;
                }
                this.helpFlag = true;
            },
            handleResize() {
                this.windowWidth = window.innerWidth;
            },
            checkWindowWidth() {
                // аналогично для блока рекламы надо
                this.orientation = window.innerWidth <= 1200 ? this.orientationH : this.orientationV;
                console.log(this.orientation);
            },
            async updateActiveComponent(index) {
                this.isBurger = false;
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
        padding: 0px 40px;
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
        @media (max-width: 1200px) {
            flex-direction: column;
        }
    }
    .left {
        width: 229px;
        display: flex;
        flex-direction: column;
        row-gap: 30px;
        @media (max-width: 1200px) {
            display: grid;
            grid-template-columns: 1fr 2fr;
            width: 100%;
            column-gap: 20px;
        }
        @media (max-width: 800px) {
            grid-template-columns: 2fr 3fr;
        }
        @media (max-width: 650px) {
            display: flex;
            flex-direction: column-reverse;
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
        @media (max-width: 650px) {
            padding: 10px;
            padding-left: 20px;
            padding-bottom: 20px;
            padding-top: 15px;
        }
    }
    .wrapper_nav_mobile {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        z-index: 999;
    }
    .footer {
        display: flex;
        justify-content: center;
        padding: 5px;
        background: #070A29;
    }
    .burger {
        display: flex;
        column-gap: 10px;
        padding: 8px;
        border-radius: 15px;
        border: 1px solid white;
        cursor: pointer;
        width: 100px;
        height: 30px;
        justify-content: center;
        align-items: center;
    }
    .burger img {
        width: 20px;
        height: 12.85px;
        pointer-events: none;
    }
    .burger span {
        font-size: 16px;
        font-family: 'OpenSans';
        font-weight: 600;
        line-height: 1.3;
        pointer-events: none;
    }
    .burger_close {
        width: 30px;
        height: 30px;
    }
    .nav_mobile {
        width: 100%;
        background: #1B1E3D;
        padding: 10px;
        border-radius: 10px;
        z-index: 5;
    }
    .item {
        width: 100%;
        border-top: 1px solid rgba(255, 255, 255, 0.10);
        padding: 5px;
        display: flex;
        align-items: center;
        padding: 10px;
        column-gap: 10px;
        cursor: pointer;
    }
    img {
        width: 20px;
        height: 20px;
        object-fit: cover;
        object-position: center;
        z-index: 5;
    }
    span {
        color: white;
        font-size: 16px;
        font-family: 'OpenSans';
        z-index: 5;
    }
    .active {
        background: #7023EC;
    }
</style>