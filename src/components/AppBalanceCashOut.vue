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
            <div class="row">
                <img src="@/assets/images/balance.png">
                <h2 v-if="userInfo">Ваш баланс: {{ userInfo.balance }} USDT</h2>
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
            <span>Вы получите {{ cashout }} USDT за вычетом комиссии.</span>
            <span v-if="isError" class="error">{{ errMsg }}</span>
            <AppGoodButton :text="text1" @click="openWaitingModal"/>
        </div>
        <div class="right">
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
    import { getUserInfo } from "@/services/user";
    import { getMoney } from "@/services/cash";
    import { refreshToken } from "@/services/auth";
    import { getConfig } from "@/services/config";
    export default {
        components: { AppGoodButton, AppModal },
        data() {
            return {
                text1: "ЗАПРОСИТЬ ВЫВОД",
                choices: ["bep", "trc"],
                bep_msg: "Обратите внимание, переводы по сети BEP-20 с минимальными комиссиями",
                activeIndex: 0,
                commision: 1,
                userInfo: null,
                usdt: "",
                adress: "",
                cashout: 0,
                waitingModal: false,
                title: "ОЖИДАЙТЕ!",
                msg: "Запрос на вывод обрабатывается. Вы всегда можете отменить вывод в разделе «История»",
                isError: false,
                errMsg: "",
                commisionData: null
            }
        },
        computed: {
            trc_msg() {
                return `Обратите внимание, переводы по сети TRC-20 с комиссией ${this.commisionData.trc} USDT`
            } 
        },
        async created() {
            const info = await getUserInfo(localStorage.getItem("token"));
            if (!info) {
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
            this.userInfo = info;

            this.commisionData = await getConfig("commissions", localStorage.getItem("token"));
            this.commision = this.commisionData.bep;
            console.log(this.commisionData);
        },
        methods: {
            setActive(index) {
                this.activeIndex = index;
                this.commision = (index == 0) ? this.commisionData.bep : this.commisionData.trc;
                this.countCashout();
            },
            countCashout() {
                if (this.usdt != "0" && Number(this.usdt) > this.commision)
                    this.cashout = Number(this.usdt) + this.commision
                else 
                    this.cashout = 0;
            },
            async openWaitingModal() {
                if (this.userInfo.balance >= this.usdt && this.adress != "" && this.usdt != "") {
                    const resp = await getMoney(this.userInfo.vk_id, this.cashout, this.adress, this.choices[this.activeIndex]);
                    if (resp.status) {
                        this.isError = false;
                        this.waitingModal = true;
                    }
                    else {
                        this.isError = true;
                    }
                } else {
                    this.isError = true;
                }
                if (this.userInfo.balance < this.usdt) 
                    this.errMsg = "Не хватает средств!";
                if (this.adress == "")
                    this.errMsg = "Заполните поле с адресом!";
                if (this.usdt == "")
                    this.errMsg = "Введите сумму для вывода!";
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
        text-decoration: up;
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
