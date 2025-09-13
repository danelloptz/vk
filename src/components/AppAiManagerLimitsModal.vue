<template>
    <div v-if="visibility1" class="modal_wrapper" id="modal_wrapper">
        <section class="modal">
            <img src="@/assets/images/close.png" class="close" @click="close">
            <span v-if="isMoreText">Если вам нужно больше писем, вы можете купить Пакет писем по мере необходимости.</span>
            <span v-else>В ваш пакет входит 30 000 писем ежемесячно, эта цифра будет возобновляться каждый месяц до окончания срока действия вашего пакета. Если вам нужно больше писем, вы можете купить Пакет писем по мере необходимости.</span>
            <span class="mt"><strong>Пакет писем 10000 - </strong>{{ prices.ten }}</span>
            <span><strong>Пакет писем 50000 - </strong>{{ prices.fifty }}</span>
            <div class="row">
                <AppBadButton :text="'КУПИТЬ 10000'" class="btn" @click="buy(10000, prices.ten)" />
                <AppBadButton :text="'КУПИТЬ 50000'" class="btn" @click="buy(50000, prices.fifty)" />
            </div>
            <span class="err" v-if="isError">{{ msg }}</span>
        </section>
    </div>
</template>

<script>
    import AppBadButton from '@/components/AppBadButton.vue';
    import { getConfig } from '@/services/config';
    import { buyLimits } from '@/services/manager';
    export default {
        components: { AppBadButton },
        props: {
            visibility1: Boolean,
            user_id: String,
            balance: Number,
            isMoreText: Boolean
        },
        data() {
            return {
                prices: null,
                msg: "",
                isError: false
            }
        },
        async created() {
            const data = await getConfig('manager_prices', localStorage.getItem('token'));
            this.prices = data;
        },
        methods: {
            async buy(amount, price) {
                if (this.balance < price) {
                    this.msg = 'Недостаточно средств на балансе';
                    this.isError = true;
                    return;
                }
                this.isError = false;
                const status = await buyLimits(this.user_id, amount);
                if (status) {
                    this.$emit('good');
                    this.close();
                }
                else {
                    this.$emit('bad');
                    this.close();
                }
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

    .mt {
        margin-top: 16px;
    }
    .err {
        color: red;
    }
    .row {
        display: flex;
        column-gap: 30px;
        margin-top: 34px;
        @media (max-width: 650px) {
            margin-top: 29px;
            column-gap: 10px;
        }
    }
    .btn {
        width: 190px;
        height: 51px;
        @media (max-width: 650px) {
            width: 140px;
            height: 40px;
        }
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
        width: 919px;
        height: 364px;
        border-radius: 10px;
        position: relative; /* Обеспечиваем позиционирование для псевдоэлемента */
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 50px;
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
            padding: 31px 20px;
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
        @media (max-width: 650px) {
            right: 20px;
            top: 30px;
            width: 18px;
            height: 18px;
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
        color: white;
        text-wrap: wrap;
        font-family: 'OpenSans';
        @media (max-width: 900px) {
            font-size: 20px;
        }
        @media (max-width: 650px) {
            font-size: 16px;
            text-align: start;
        }
    }
    .left_image {
        position: absolute;
        bottom: 47px;
        left: 37px;
        width: 60px;
        height: 60px;
        transform: rotate(-140deg);
        @media (max-width: 900px) {
            width: 70px;
            height: 70px;
        }
        @media (max-width: 650px) {
            width: 81px;
            height: 81px;
            top: 23px;
            left: 5px;
        }
    }
    .right_image {
        position: absolute;
        top: 17px;
        right: 89px;
        width: 112px;
        height: 112px;
        transform: rotate(16deg);
        @media (max-width: 900px) {
            width: 70px;
            height: 70px;
        }
        @media (max-width: 650px) {
            width: 50px;
            height: 50px;
            right: 15px;
            bottom: 45px;
            top: auto;
        }
    }
</style>