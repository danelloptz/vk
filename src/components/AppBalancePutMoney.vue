<template>
    <AppModalHash 
        :visibility1="isOpen" 
        @update:visibility1="isOpen = $event"
        @close="closeModal" 
    />
    <AppModal
        :title="title" 
        :message="msg" 
        :visibility1="isMoneyPut"
        @update:visibility1="isMoneyPut = $event"
        @close="closeModalMoneyPut" 
    />
    <section class="cashout">
        <div class="left" v-if="!stepTwo">
            <div class="row" v-if="windowWidth > 650">
                <img src="@/assets/images/balance.png">
                <h2 v-if="userData">Ваш баланс: {{ userData?.balance?.toFixed(2)  }} USDT</h2>
            </div>
            <div class="item">
                <input 
                    type="number"
                    v-model="usdt"
                    placeholder="USDT"
                >
                <span>Минимальная сумма пополнения 1 USDT</span>
            </div>
            <AppGoodButton class="btn" :text="text1" @click="checkCash" />
        </div>
        <div class="right" v-if="!stepTwo">
            <div class="row" v-if="windowWidth <= 650">
                <img src="@/assets/images/balance.png">
                <h2 v-if="userData">Ваш баланс: {{ userData?.balance?.toFixed(2)  }} USDT</h2>
            </div>
            <h2>Выберите сеть для пополнения:</h2>
            <div class="right_row">
                <span
                    v-for="(item, index) in choices"
                    :key="index"
                    :class="{ active: index === activeIndex }"
                    @click="setActive(index)"
                > {{ item }} </span>
            </div>
            <span v-html="(activeIndex == 0) ? bep_msg : trc_msg"></span>
        </div>
        <div class="steptwo" v-if="stepTwo">
            <div class="row">
                <img src="@/assets/images/balance.png">
                <h2 v-if="userData">Ваш баланс: {{ userData?.balance?.toFixed(2)  }} USDT</h2>
            </div>
            <div class="item">
                <span>Для пополнения отправьте {{ cashout }} USDT (сеть {{ choices[activeIndex] }}) на кошелек: </span>
                <div class="hash">
                    <span><strong>{{ hash }}</strong></span>
                    <img src="@/assets/images/copy.png" @click="copy(hash)">
                    <span v-if="isCopy" class="green">Скопировано!</span>
                </div>
            </div>
            <span>Убедитесь, что адрес правильный и относится к той же сети! Транзакции невозможно отменить. После завершения транзакции отправьте ниже хэш (TxID) вашей транзакции. Зачисление средств происходит автоматически только после подтверждения хэша (TxID). </span>
            <a @click="openModal">Инструкция, где взять хэш (TxID)</a>
            <span v-if="isError&& windowWidth > 650" class="error" >{{ errorMessage }}</span>
            <div class="input">
                <input 
                    v-model="txid"
                    placeholder="TxID транзакция"
                >
                <span v-if="isError && windowWidth <= 650" class="error" ><img src="@/assets/images/cross2.png"> {{ errorMessage }}</span>
                <AppGoodButton :text="text2" class="txid" @click="check" />
            </div>
        </div>
    </section>
</template>

<script>
    import AppGoodButton from "@/components/AppGoodButton.vue";
    import AppModalHash from "@/components/AppModalHash.vue";
    import AppModal from "@/components/AppModal.vue";
    import { putMoney } from "@/services/cash";
    import { getConfig } from "@/services/config";
    
    export default {
        components: { AppGoodButton, AppModalHash, AppModal },
        props: { 
            userData: Object,
            windowWidth: Number
        },
        data() {
            return {
                text1: "ПОПОЛНИТЬ БАЛАНС",
                text2: "Я ОПЛАТИЛ",
                choices: ["BEP-20", "TRC-20"],
                bep_msg: "Обратите внимание, пополнение по сети BEP-20 с дополнительным подтверждением через <a href='https://t.me/IntelektazSupport'>службу поддержки</a>.",
                activeIndex: 0,
                commision: 1,
                usdt: "",
                cashout: 0,
                minCash: 10,
                stepTwo: false,
                isOpen: false,
                txid: "",
                title: "УСПЕШНО!",
                msg: "Ваш баланс пополнен",
                isMoneyPut: false,
                isError: false,
                errorMessage: "",
                commisionData: null,
                depositData: null,
                isCopy: false,
                disabled: false
            }
        },
        computed: {
            trc_msg() {
                return `Обратите внимание, комиссия сети TRC-20 выше, чем по сети BEP-20`
            },
            hash() {
                return this.activeIndex == 0 ? this.depositData.bsc : this.depositData.trc;
            }
        },
        async created() {
            this.commisionData = await getConfig("commissions", localStorage.getItem("token"));
            this.commision = this.commisionData.bep;
            this.depositData = await getConfig("deposit_addresses", localStorage.getItem("token"));
        },
        methods: {
            async setActive(index) {
                this.commisionData = await getConfig("commissions", localStorage.getItem("token"));
                this.activeIndex = index;
                this.commision = (index == 0) ? this.commisionData.bep : this.commisionData.trc;
            },
            checkCash() {
                if ( !(this.usdt != ""))
                    console.log('bad')
                else {
                    this.cashout = Number(this.usdt);
                    this.stepTwo = true;
                }
            },
            openModal() {
                this.isOpen = true;
            },
            closeModal() {
                this.isOpen = false;
            },
            async check() {
                if (this.disabled) return;
                this.isError = false;
                if (this.txid != "" && this.txid != this.choices[this.activeIndex]) {
                    const contract = this.activeIndex == 0 ? this.depositData.bsc_contract_address : this.depositData.trc_contract_address;
                    const wallet =  this.activeIndex == 0 ? this.depositData.bsc : this.depositData.trc;
                    try {
                        this.disabled = true;
                        const response = await putMoney(this.cashout, this.txid, contract, wallet, ["BSC20", "TRC20"][this.activeIndex], localStorage.getItem("token"));
                        console.log(response);
                        if (!response.isError) {
                            this.isMoneyPut = true;
                            this.isError = false;
                        }
                        else {
                            this.isError = true;
                            if (response.message.indexOf("been used")) this.errorMessage = "Этот хэш уже был использован!"
                            else if (response.message.indexOf("Хэш не найден")) this.errorMessage = "Хэш не найден!"
                            else this.errorMessage = response.message;
                        }
                        this.disabled = false;
                    } catch(e) {
                        this.isError = true;
                        this.errorMessage = "Неправильный хэш!";
                        this.disabled = false;
                    }
                    
                }
                if (this.txid == this.choices[this.activeIndex]) {
                    this.isError = true;
                    this.errorMessage = "Неправильный хэш!";
                    this.disabled = false;
                }
                if (this.txid == "") {
                    this.isError = true;
                    this.errorMessage = "Заполните поле с хэшем!";
                    this.disabled = false;
                }
            },
            closeModalMoneyPut() {
                this.isMoneyPut = false;
                this.stepTwo = false;
                window.location.reload();
            },
            async copy(link) {
                this.isCopy = true;
                await navigator.clipboard.writeText(link);
                setTimeout(() => { this.isCopy = false; }, 2000);
            }
        }
    };
</script>

<style scoped>
    .cashout {
        display: flex;
        justify-content: space-between;
        @media (max-width: 1300px) {
            column-gap: 50px;
        }
        @media (max-width: 700px) {
            justify-content: start;
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
        display: flex;
        justify-content: center;
        align-items: center;
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
    .btn {
        @media (max-width: 650px) {
            width: 190px !important;
            align-self: center !important;
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
    .steptwo {
        display: flex;
        flex-direction: column;
        row-gap: 30px;
    }
    .item {
        display: flex;
        flex-direction: column;
        row-gap: 10px;
    }
    .steptwo span, a {
        font-size: 18px;
        color: white;
        font-family: 'OpenSans';
    }
    .input {
        display: flex;
        column-gap: 30px;
        align-items: center;
        height: 60px;
        @media (max-width: 650px) {
            flex-direction: column;
            height: auto;
            row-gap: 20px;
        }
    }
    .steptwo input {
        width: 360px;
        height: 100%;
        @media (max-width: 650px) {
            width: 100%;
            height: 50px;
        }
    }
    .txid {
        height: 100%;
        width: 170px;
        @media (max-width: 650px) {
            height: 50px;
        }
    }
    a {
        text-decoration: underline;
        cursor: pointer;
    }
    .error {
        color: #FF6666 !important;
        display: flex;
        align-items: center;
    }
    .error img {
        width: 20px;
        height: 20px;
        margin-right: 10px;
    }
    .green {
        color: green !important;
        animation: ShowEasy 2s ease-in;
        opacity: 0;
    }
    @keyframes ShowEasy {
        0% { opacity: 0; }
        50% { opacity: 1; }
        100% { opacity: 0; }
    }
    .hash {
        display: flex;
        align-items: center;
        column-gap: 10px;
        @media (max-width: 650px) {
            flex-wrap: wrap;
        }
    }
    .hash img {
        width: 20px;
        height: 20px;
        cursor: pointer;
    }
    .hash span {
        line-height: 2;
        @media (max-width: 650px) {
            line-height: 1.3;
            word-break: break-all;
        }
    }
    .right {
        @media (max-width: 650px) {
            row-gap: 10px;
        }
    }
</style>
