<template>
    <section class="cashout">
        <div class="left">
            <div class="row">
                <img src="@/assets/images/balance.png">
                <h2 v-if="userInfo">Ваш баланс: {{ userInfo.balance }} USDT</h2>
            </div>
            <div class="item">
                <input 
                    type="number"
                    v-model="usdt"
                    placeholder="USDT"
                >
                <span>Минимальная сумма пополнения 1 USDT</span>
            </div>
            <AppGoodButton :text="text1" @click="checkCash" />
        </div>
        <div class="right">
            <h2>Выберите сеть для пополнения:</h2>
            <div class="right_row">
                <span
                    v-for="(item, index) in choices"
                    :key="index"
                    :class="{ active: index === activeIndex }"
                    @click="setActive(index)"
                > {{ item }} </span>
            </div>
            <span>{{ (activeIndex == 0) ? bep_msg : trc_msg }}</span>
        </div>
    </section>
</template>

<script>
    import AppGoodButton from "@/components/AppGoodButton.vue";
    import { getUserInfoLocal } from "@/services/user";
    export default {
        components: { AppGoodButton },
        data() {
            return {
                text1: "ПОПОЛНИТЬ БАЛАНС",
                choices: ["BEP-20", "TRC-20"],
                bep_msg: "Обратите внимание, переводы по сети BEP-20 с минимальными комиссиями",
                trc_msg: "Обратите внимание, переводы по сети TRC-20 с комиссией 5 USDT",
                activeIndex: 0,
                commision: 1,
                userInfo: null,
                usdt: "",
                cashout: 0,
                minCash: 10,
            }
        },
        async created() {
            const info = await getUserInfoLocal();
            this.userInfo = info;
        },
        methods: {
            setActive(index) {
                this.activeIndex = index;
                this.commision = (index == 0) ? 1 : 5;
            },
            checkCash() {
                if ( !(this.usdt != "" && Number(this.usdt) > this.commision))
                    console.log('bad');
                // TODO: переключение на следующий этап 
            }
        }
    };
</script>

<style scoped>
    .cashout {
        display: flex;
        column-gap: 200px;
        @media (max-width: 1300px) {
            column-gap: 50px;
        }
        @media (max-width: 700px) {
            flex-direction: column-reverse;
            row-gap: 40px;
        }
    }
    .left, .right {
        display: flex;
        flex-direction: column;
        row-gap: 30px;
    }
    .row {
        display: flex;
        column-gap: 10px;
        align-items: center;
    }
    .row img {
        width: 25px;
        height: 25px;
        object-fit: cover;
        object-position: center;
    }
    h2 {
        font-size: 20px;
        color: white;
        font-weight: bold;
        font-family: 'OpenSans';
    }
    .item {
        display: flex;
        flex-direction: column;
        row-gap: 10px;
    }
    input {
        width: 100%;
        height: 60px;
        padding: 0 20px;
        box-sizing: border-box;
        font-size: 16px;
        color: rgba(255, 255, 255, 0.5);
        background: none;
        border: 1px solid white;
        border-radius: 10px;
        font-family: 'OpenSans';
        position: relative;
        @media (max-width: 500px) {
            width: 70vw;
        }
    }
    span {
        font-size: 16px;
        color: white;
        font-family: 'OpenSans';
    }
    .right {
        width: 300px;
        @media (max-width: 700px) {
            width: auto;
        }
    }
    .right_row {
        display: flex;
        column-gap: 20px;
    }
    .right_row span {
        width: 140px;
        height: 60px;
        text-align: center;
        align-content: center;
        font-size: 24px;
        color: white;
        font-family: 'OpenSans';
        font-weight: bold;
        border: 1px solid white;
        transition: .1s ease-in;
        cursor: pointer;
        @media (max-width: 450px) {
            font-size: 20px;
            width: 100px;
        }
    }
    .active {
        background: #7023EC;
        border: none !important;
    }
    input[type="number"]::-webkit-inner-spin-button,
    input[type="number"]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    input[type="number"] {
        -moz-appearance: textfield;
    }
</style>
