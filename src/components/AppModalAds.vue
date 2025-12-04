<template>
    <div v-if="visibility1" class="modal_wrapper" id="modal_wrapper">
        <section class="modal">
            <img src="@/assets/images/close.png" class="close" @click="close">
            <h2>Получи тариф бесплатно в рамках Intelektaz Ads!</h2>
            <span>Вы можете бесплатно активировать тариф Standart 30 USDT в месяц, если на вашем канале 50 - 3 000 подписчиков или VIP тариф, стоимостью 50 USDT в месяц, если на вашем канале более 3 000 подписчиков.</span>
            <span style="margin-bottom: 10px;">Для этого вам необходимо подключить функцию Intelektaz Ads.
                Принцип работы похож на Google Ads и Яндекс Рекламу, только вы получаете не центы за клики с высокими лимитами на вывод, а гарантированную выгоду в виде экономии 30-50 USDT каждый месяц, без лимитов по времени!</span>
            <span>После подключения Intelektaz Ads на ваш ТГ канал будет периодически публиковаться Business предложение пакетов Business и Leader. У вас на канале будет только 1 активный рекламный пост, который запрещено удалять.</span>
            <span>При удалении поста Intelektaz Ads тариф автоматически отключается. 
Если вам не хватает подписчиков вы можете их добрать через ротацию сервиса Intelektaz.</span>
            <div class="row">
                <AppGoodButton class="btn" :text="'ПОДКЛЮЧИТЬ'" @click="turnOn" />
                <AppGoodButton class="btn" :text="'РОТАЦИЯ'" @click="openRotation" />
                <AppBadButton class="btn back_btn" :text="'НАЗАД'" @click="cancel" />
            </div>
        </section>
    </div>
</template>

<script>
import AppBadButton from "@/components/AppBadButton.vue";
import AppGoodButton from "@/components/AppGoodButton.vue";
import { getTariffs } from '@/services/cash';

export default {
    components: { AppBadButton, AppGoodButton },
    props: {
        visibility1: Boolean,
    },
    data() {
        return {
            text1: "ДА",
            text2: "НЕТ",
            title: "",
            msg: "",
            isModal: false,
            prices: null
        };
    },
    async created() {
        const prices = await getTariffs(localStorage.getItem('token'));
        this.prices = prices;
    },
    methods: {
        confirm() {
            this.$emit("update:visibility1", false);
        },
        cancel() {
            this.$emit("update:visibility1", false);
        },
        turnOn() {
            this.$emit("turn_on");
        },
        openRotation() {
            this.$emit("open_rotation");
        },
        close() {
            if (this.visibility1) {
                this.$emit('update:visibility1', false);
            }
            this.$emit('close'); 
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

    h3 {
        font-size: 18px;
        color: white;
        font-family: 'OpenSans';
        font-weight: normal;
    }
    .back_btn {
        @media (max-width: 650px) {
            width: 100% !important;
        }
    }
    h1, h2, span, img {
        z-index: 5;
    }
    h2 {
        font-size: 24px;
        color: white;
        font-family: 'OpenSans';
    }
    .modal_wrapper {
        width: 100vw;
        height: 100vh;
        position: absolute;
        left: 0;
        top: 0;
        z-index: 900;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .modal {
        width: 760px;
        border-radius: 10px;
        position: relative; /* Обеспечиваем позиционирование для псевдоэлемента */
        display: flex;
        flex-direction: column;
        /* justify-content: center; */
        padding: 75px 54px 50px 54px;
        z-index: 2;
        overflow-y: auto;
        scrollbar-width: none;
        row-gap: 10px;
        box-sizing: border-box;
        margin-top: -50px;
        align-self: center;
        background: #1B1E3D;
        border-radius: 10px;
        height: 80vh;
        /* align-items: start; */
        overflow-y: scroll;
        @media (max-width: 1400px) {
            width: 80vw;
        }
        @media (max-width: 650px) {
            width: 90vw;
            padding: 60px 15px;
        }
    }

    .modal::-webkit-scrollbar {
        width: 0;  
        height: 0;
    }

    .modal::-webkit-scrollbar-thumb {
        background: transparent;
    }

    .close {
        position: absolute;
        right: 30px;
        top: 30px;
        width: 21px;
        height: 21px;
        cursor: pointer;
        @media (max-width: 450px) {
            right: 20px;
            top: 20px;
        }
    }
    .modal-background {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: url("@/assets/images/background.png");
        background-color: #1B1E3D;
        background-size: contain;
        background-position: center;
        background-blend-mode: multiply;
        background-repeat: repeat-y;
        opacity: 0.25; 
        background-size: 300%;
        filter: brightness(140%) contrast(80%);
        border-radius: 10px;
    }

    h1 {
        font-size: 48px;
        color: white;
        font-family: 'Tektur';
        line-height: 62.4px;
        font-weight: 400;
        @media (max-width: 900px) {
            font-size: 35px;
        }
        @media (max-width: 500px) {
            font-size: 30px;
        }
    }
    span {
        font-size: 18px;
        font-family: 'OpenSans';
        font-weight: 400;
        line-height: 32.68px;
        color: white;
        text-wrap: wrap;
        font-family: 'OpenSans';
        @media (max-width: 900px) {
            font-size: 20px;
        }
        @media (max-width: 650px) {
            font-size: 16px;
        }
    }
    .left_image {
        position: absolute;
        bottom: 47px;
        left: 37px;
        width: 60px;
        height: 60px;
        transform: rotate(157deg);
        @media (max-width: 900px) {
            width: 70px;
            height: 70px;
        }
        @media (max-width: 650px) {
            display: none;
        }
    }
    .right_image {
        position: absolute;
        top: 17px;
        right: 89px;
        width: 112px;
        height: 112px;
        transform: rotate(-9deg);
        @media (max-width: 900px) {
            width: 70px;
            height: 70px;
        }
        @media (max-width: 650px) {
            display: none;
        }
    }
    .row {
        display: flex;
        column-gap: 30px;
        margin-top: 26px;
        @media (max-width: 750px) {
            column-gap: 10px;
            align-self: center;
            flex-wrap: wrap;
            justify-content: space-between;
            row-gap: 10px;
        }
    }
    .btn {
        width: 170px;
        @media (max-width: 750px) {
            width: 140px;
            height: 40px;
        }
    }
</style>