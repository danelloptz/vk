<template>
    <AppModal
        :title="title" 
        :message="msg" 
        :visibility1="endModal"
        @update:visibility1="endModal = $event"
        @close="reload"
    />
    <section class="send" v-if="!stepTwo">
        <div class="row">
            <img src="@/assets/images/balance.png">
            <h2 v-if="userData">Ваш баланс: {{ userData?.balance?.toFixed(2)  }} USDT</h2>
        </div>
        <div class="item">
            <input 
                type="number"
                v-model="usdt"
                placeholder="USDT"
            >
            <span>Минимальная сумма перевода 1 USDT</span>
        </div>
        <div class="item">
            <input 
                v-model="userId"
                placeholder="ID пользователя"
            >
            <span v-if="isError" class="error">{{ errorMsg }}</span>
        </div>
        <AppGoodButton class="btn" :text="text1" @click="send" />
        
    </section>
    <section class="send" v-if="stepTwo">
        <div class="row">
            <img src="@/assets/images/balance.png">
            <h2 v-if="userData">Ваш баланс: {{ userData?.balance?.toFixed(2)  }} USDT</h2>
        </div>
        <span>Подтвердите перевод. Вы хотите перевести {{ usdt }} USDT пользователю</span>
        <div class="user_tosend">
            <div class="user">
                <img :src="userToSend.avatar_url" @click="redirect(userToSend.vk_id)">
                <div class="text_wrapper">
                    <h3>{{ `${userToSend.name}` }}</h3>
                    <span>ID: {{ userToSend.vk_id }}</span>
                </div>
            </div>
            <div class="btns">
                <AppGoodButton :text="text1" class="btn1" @click="sendMoney" />
                <AppBadButton :text="text2"  class="btn1" @click="returnBack"  />
            </div>
        </div>
    </section>
</template>

<script>
    import AppGoodButton from "@/components/AppGoodButton.vue";
    import AppBadButton from "@/components/AppBadButton.vue";
    import AppModal from "@/components/AppModal.vue";
    import { getUserInfoById } from "@/services/user";
    import { sendTo } from "@/services/cash";
    import { refreshToken } from "@/services/auth";

    export default {
        components: { AppGoodButton, AppBadButton, AppModal },
        props: { userData: Object },
        data() {
            return {
                text1: "ПОДТВЕРДИТЬ",
                text2: "НАЗАД",
                usdt: "",
                cashout: 0,
                minCash: 1,
                userId: "",
                isError: false,
                userToSend: null,
                stepTwo: false,
                errorMsg: "",
                title: "УСПЕШНО",
                msg: "Средства были переведены пользователю",
                endModal: false,
                disabled: false
            }
        },
        methods: {
            async send() {
                if (this.disabled) return;
                if (this.userId != "" && Number(this.userData.balance) >= Number(this.usdt)) {
                    this.disabled = true;
                    const response = await getUserInfoById(this.userId, localStorage.getItem("token"));
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
                    this.userToSend = response;

                    if (this.userToSend != null) 
                        this.stepTwo = true
                    else {
                        this.stepTwo = false;
                        this.isError = true;
                        this.errorMsg = "Нет пользователя с таким ID!"
                    }
                    this.disabled = false;
                } else {
                    this.isError = true;
                }
                if (this.userId == "")
                    this.errorMsg = "Введите id пользователя!";
                if (Number(this.userData.balance) < Number(this.usdt))
                    this.errorMsg = "Не хватает средств!";
            },
            async sendMoney() {
                if (this.disabled) return;
                this.disabled = true;
                const response = await sendTo(this.userToSend.vk_id, this.usdt, localStorage.getItem("token"));
                if (response) {
                    this.endModal = true;
                    this.stepTwo = false;
                } 
                this.disabled = true;
            },
            reload() {
                window.location.reload();
            },
            redirect(id) {
                window.open(`https://vk.com/id${id}`, "_blank");
            },
            returnBack() {
                this.stepTwo = false;
            }
        }
    };
</script>

<style scoped>
    .send {
        display: flex;
        flex-direction: column;
        row-gap: 30px;
    }
    input {
        max-width: 364px;
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
            width: 100%;
            height: 50px;
        }
    }
    input[type="number"]::-webkit-inner-spin-button,
    input[type="number"]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    input[type="number"] {
        -moz-appearance: textfield;
    }
    span {
        font-size: 16px;
        color: white;
        font-family: 'OpenSans';
        @media (max-width: 650px) {
            font-size: 14px;
        }
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
        @media (max-width: 650px) {
            font-size: 16px;
        }
    }
    .item {
        display: flex;
        flex-direction: column;
        row-gap: 10px;
    }
    .user_tosend {
        display: flex;
        justify-content: space-between;
        align-items: center;
        @media (max-width: 700px) {
            flex-direction: column;
            justify-content: start;
            align-items: start;
            row-gap: 30px;
        }
    }
    .user {
        display: flex;
        column-gap: 30px;
        align-items: center;
    }
    .user img {
        width: 150px;
        height: 150px;
        object-fit: cover;
        object-position: center;
        border-radius: 50%;
        outline: 1px solid white;
        outline-offset: 10px;
        cursor: pointer;
        @media (max-width: 650px) {
            width: 90px;
            height: 90px;
        }
    }
    .text_wrapper {
        display: flex;
        flex-direction: column;
        row-gap: 14px;
    }
    .text_wrapper h3 {
        font-size: 20px;
        color: white;
        font-weight: bold;
        font-family: 'OpenSans';
        @media (max-width: 650px) {
            font-size: 16px;
        }
    }
    .btns {
        display: flex;
        flex-direction: column;
        row-gap: 30px;
        @media (max-width: 700px) {
            row-gap: 20px;
            align-self: center;
        }
    }
    .btn {
        @media (max-width: 650px) {
            width: 190px;
            align-self: center;
        }
    }
    .btn1 {
        @media (max-width: 650px) {
            width: 210px;
            align-self: center;
        }
    }
    .error {
        color: red !important;
    }
</style>