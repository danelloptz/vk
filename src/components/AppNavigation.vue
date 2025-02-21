<template>
    <nav class="nav" :style="{ left: isShown ? pos : '-229px' }">
        <div 
            class="genius_thing" 
            @click="setShown"
            :style="{ 
                background: isShown ? background : '#7023EC' ,
                zIndex: isShown ? zindex : 4
            }"
        >
            <img 
                src="@/assets/images/close.png"
                :style="{ display: isShown ? display : 'none' }"
            >
        </div>
            <div class="wrapper">
                <div 
                    class="item" 
                    v-for="(menu, index) in updatedMenuItems" 
                    :key="index" 
                    :class="{ active: activeIndex === index }" 
                    @click="setActive(index)"
                >
                    <img :src="menu.img" />
                    <span>{{ menu.label }}</span>
                </div>
            </div>
    </nav>
</template>

<script>
    import { getUserInfo } from "@/services/user";
    import { refreshToken } from "@/services/auth";

    export default {
        props: {
            indexPage: Number
        },
        data() {
            return {
                activeIndex: this.indexPage, 
                menuItems: [
                    { img: require('@/assets/images/balance.png'), label: 'Баланс: ' },
                    { img: require('@/assets/images/home.png'), label: 'Главная' },
                    { img: require('@/assets/images/Ai.png'), label: 'ИИ генератор' },
                    { img: require('@/assets/images/structure.png'), label: 'Структура' },
                    { img: require('@/assets/images/rotation.png'), label: 'Ротация' },
                    { img: require('@/assets/images/settings.png'), label: 'Настройки' },
                    { img: require('@/assets/images/instructions.png'), label: 'Инструкции' },
                ],
                pos: "50px !important",
                isShown: false,
                background: "#1B1E3D",
                display: "block",
                zindex: 6,
                userInfo: null
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
        },
        watch: {
            indexPage(newValue) {
                this.activeIndex = newValue; // Обновляем activeIndex при изменении indexPage
            }
        },
        computed: {
            updatedMenuItems() {
                return this.menuItems.map((item, index) => {
                    if (index === 0 && this.userInfo) {
                        return { ...item, label: `Баланс: ${this.userInfo.balance} USDT` };
                    }
                    return item;
                });
            }
        },
        methods: {
            setActive(index) {
                this.activeIndex = index;
                this.$emit("update-active-index", index);
                this.$emit("update-isClicked", false);
                if (this.isShown ) this.setShown();
            },
            setShown() {
                this.isShown = !(this.isShown);
            }
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
    .nav {
        display: flex;
        flex-direction: column;
        width: 229px;
        row-gap: 4px;
        transition: all ease 0.2s;
        position: relative;
        left: 0 !important;
        @media (max-width: 1000px) {
            position: absolute;
            left: -229px !important;
        }
    }
    .genius_thing {
        position: absolute;
        top: -25px;
        right: -25px;
        border-radius: 50% ;
        width: 80px;
        height: 80px;
        background: #7023EC;
        z-index: 4;
        transition: all ease 0.2s;
        cursor: pointer;
        display: none;
        @media (max-width: 1000px) {
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
    .genius_thing img {
        width: 20px;
        height: 20px;
    }
    .wrapper {
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