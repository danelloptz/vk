<template>
    <AppModal 
        :title="title" 
        :message="msg" 
        :visibility1="isModal"
        @close="close"
        @update:visibility1="isModal = $event"
    />
    <div v-if="visibility1 && !isModal" class="modal_wrapper" id="modal_wrapper">
        <section class="modal">
            <img src="@/assets/images/close.png" class="close" @click="close">
            <span><strong>Месячный лимит исчерпан, доступных генераций нет.</strong></span>
            <span>Генерация 1 баннера сверх лимита стоит <strong>0,6 USDT</strong></span>
            <span style="margin-bottom: 10px;">Вы выбрали {{ bannerAmount }} баннеров. Вы подтверждаете списание с баланса {{ Math.ceil(payment * 100) / 100 }} USDT?</span>
            <span>Вы можете купить Пакет 100 или 500 генераций со скидкой:</span>
            <span><strong>Пакет Генераций 100</strong> - цена 50 USDT, цена 1 баннера = 0.5 USDT</span>
            <span><strong>Пакет Генераций 500</strong> - цена 200 USDT, цена 1 баннера = 0.4 USDT</span>
            <div class="row">
                <AppBadButton class="btn" :text="'ОПЛАТИТЬ'" @click="buy(bannerAmount)" />
                <AppBadButton class="btn" :text="'КУПИТЬ 100'" @click="buy(100)" />
                <AppBadButton class="btn" :text="'КУПИТЬ 500'" @click="buy(500)" />
                <AppBadButton class="btn" :text="'ОТМЕНИТЬ'" @click="close" />
            </div>
        </section>
    </div>
</template>

<script>
import AppBadButton from "@/components/AppBadButton.vue";
import AppModal from "@/components/AppModal.vue";
import { buyGenerations } from "@/services/ai";

export default {
    components: { AppBadButton, AppModal },
    props: {
        visibility1: Boolean,
        userData: Object,
        bannerAmount: Number,
        payment: Number
    },
    data() {
        return {
            text1: "ДА",
            text2: "НЕТ",
            title: "",
            msg: "",
            isModal: false
        };
    },
    methods: {
        confirm() {
            this.$emit("update:visibility1", false);
        },
        cancel() {
            this.$emit("update:visibility1", false);
        },
        async buy(amount) {
            const payment = amount == 100 ? 50 : amount == 500 ? 200 : amount;
            if (( (payment == 50 || payment == 200) && this.userData.balance < payment) || (this.userData.balance < payment * 0.6)) {
                this.title = "ОШИБКА!";
                this.msg = "Недостаточно средств. Пополните баланс.";
                this.isModal = true;
                return;
            }
            const resp = await buyGenerations(this.userData.vk_id, amount);
            if (resp.isError) {
                this.title = "ОШИБКА!";
                this.msg = "При покупке лимитов возникла ошибка. Обновите страницу. Если проблема осталась, то обратитесь в техническую поддержку.";
                this.isModal = true;
                return;
            }
            if (!resp.status) {
                this.title = "ОШИБКА!";
                this.msg = resp.message;
                this.isModal = true;
                return;
            } else {
                this.title = "УСПЕХ!";
                this.msg = "Пакеты успешно куплены.";
                this.$emit("success_payment");
            }
        },
        close() {
            this.$emit("bad_payment");
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
    h1, h2, span, img {
        z-index: 5;
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
        justify-content: center;
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
            justify-content: center;
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