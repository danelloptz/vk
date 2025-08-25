<template>
    <AppModal
        :title="title" 
        :message="msg" 
        :visibility1="waitingModal"
        @update:visibility1="waitingModal = $event"
        @close="closeModalWaiting" 
    />
    <section class="cashout">
        <div class="left">
            <div class="row" v-if="windowWidth > 650">
                <img src="@/assets/images/balance.png">
                <h2 v-if="userData">Ваш баланс: {{ userData?.balance?.toFixed(2) }} USDT</h2>
            </div>
            <div class="item">
                <input 
                    type="number"
                    v-model="usdt"
                    placeholder="USDT"
                    @input="countCashout"
                >
                <span>Комиссия {{ commision }} USDT включена</span>
            </div>
            <div class="item">
                <input 
                    v-model="adress"
                    :placeholder="`Адрес ${choices[activeIndex].toUpperCase()}-20`"
                >
                <span>Если вы укажите адрес другой сети, средства будут утеряны безвозвратно!</span>
            </div>
            
            <span>Вывод обрабатывается в течение рабочего дня</span>
            <span :style="{ marginTop: windowWidth <= 650 ? '-20px' : '0px' }">Вы получите <strong>{{ cashout }}</strong> USDT за вычетом комиссии.</span>
            <span v-if="isError" class="error">{{ errMsg }}</span>
            <AppGoodButton :text="text1" class="btn" @click="openWaitingModal"/>
        </div>
        <div class="right">
            <div class="row" v-if="windowWidth <= 650">
                <img src="@/assets/images/balance.png">
                <h2 v-if="userData">Ваш баланс: {{ userData?.balance?.toFixed(2) }} USDT</h2>
            </div>
            <h2>Выберите сеть для вывода:</h2>
            <div class="right_row">
                <span
                    v-for="(item, index) in choices"
                    :key="index"
                    :class="{ active: index === activeIndex }"
                    @click="setActive(index)"
                    style="text-transform: uppercase;"
                > {{ item }}-20 </span>
            </div>
            <span>{{ (activeIndex == 0) ? bep_msg : trc_msg }}</span>
        </div>
    </section>
</template>

<script>
    import AppGoodButton from "@/components/AppGoodButton.vue";
    import AppModal from "@/components/AppModal.vue";
    import { getMoney } from "@/services/cash";
    import { getConfig } from "@/services/config";
    export default {
        components: { AppGoodButton, AppModal },
        props: { 
            userData: Object,
            windowWidth: Number
        },
        data() {
            return {
                text1: "ЗАПРОСИТЬ ВЫВОД",
                choices: ["bep", "trc"],
                bep_msg: "Обратите внимание, выводы по сети BEP-20 с минимальными комиссиями",
                activeIndex: 0,
                commision: 1,
                usdt: "",
                adress: "",
                cashout: 0,
                waitingModal: false,
                title: "ОЖИДАЙТЕ!",
                msg: "Запрос на вывод обрабатывается. Вы всегда можете отменить вывод в разделе «Финансовая история»",
                isError: false,
                errMsg: "",
                commisionData: null,
                disabled: false,
            }
        },
        computed: {
            trc_msg() {
                return `Обратите внимание, выводы по сети TRC-20 с комиссией ${this.commisionData.trc} USDT`
            } 
        },
        async created() {
            this.commisionData = await getConfig("commissions", localStorage.getItem("token"));
            this.commision = this.commisionData.bep;
        },
        methods: {
            setActive(index) {
                this.activeIndex = index;
                this.commision = (index == 0) ? this.commisionData.bep : this.commisionData.trc;
                this.countCashout();
            },
            countCashout() {
                if (this.usdt != "0" && Number(this.usdt) > this.commision)
                    this.cashout = Number(this.usdt) - this.commision
                else 
                    this.cashout = 0;
            },
            async openWaitingModal() {
                if (this.disabled) return;
                if (this.userData.balance >= this.usdt && this.adress != "" && this.usdt != "" && this.usdt >= 10 && Number.isInteger(this.usdt)) {
                    this.disabled = true;
                    const resp = await getMoney(this.userData.vk_id, this.cashout, this.adress, this.choices[this.activeIndex], this.commision);
                    console.log(resp);
                    if (resp.status) {
                        this.isError = false;
                        this.waitingModal = true;
                    }
                    else {
                        this.isError = true;
                        if (resp.code == 422) 
                            this.errMsg = "Неправильно введённые данные!";
                    }
                    this.disabled = false;
                } else {
                    this.isError = true;
                    this.disabled = false;
                }
                if (this.userData.balance < this.usdt) 
                    this.errMsg = "Не хватает средств!";
                if (this.adress == "")
                    this.errMsg = "Заполните поле с адресом!";
                if (this.usdt == "")
                    this.errMsg = "Введите сумму для вывода!";
                if (this.usdt < 10)
                    this.errMsg = "Минимальная сумма вывода 10 USDT!";
                if (!Number.isInteger(this.usdt))
                    this.errMsg = "Ошибка, пишите только целые числа!";

            },
            closeModalWaiting() {
                this.waitingModal = false;
                window.location.reload();
            }
        }
    };
</script>

<style scoped>
    .error {
        color: red;
    }
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
    .right {
        @media (max-width: 650px) {
            row-gap: 10px;
        }
    }
    .row {
        display: flex;
        column-gap: 10px;
        align-items: center;
        @media (max-width: 650px) {
            margin-bottom: 30px;
        }
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
        @media (max-width: 650px) {
            font-size: 16px;
        }
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
        @media (max-width: 650px) {
            height: 50px;
            font-size: 14px;
        }
    }
    span {
        font-size: 16px;
        color: white;
        font-family: 'OpenSans';
        @media (max-width: 650px) {
            font-size: 14px;
        }
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
        @media (max-width: 650px) {
            column-gap: 10px;
        }
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
        text-decoration: up;
        @media (max-width: 650px) {
            font-size: 20px;
            min-width: 150px;
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

    .btn {
        width: 190px !important;
        align-self: center;
    }
</style>
