<template>
    <div v-if="visibility1" class="modal_wrapper" id="modal_wrapper">
        <section class="modal">
            <!-- <div class="modal-background"></div> -->
            <img src="@/assets/images/close.png" class="close" @click="close">
            <h1>ОПЛАТА</h1>
            <span>Баланс: {{ userData.balance }}</span>
            
            <div class="item">
                <h2>Услуга:</h2>
                <div class="dropdown">
                    <input
                        v-model="selectedPackage"
                        type="text"
                        placeholder="Выберите план*"
                        @focus="isDropdownVisiblePackage = true"
                        @blur="hideDropdownPackage"
                        readonly 
                    />
                    <img :class="{'rotated': isDropdownVisiblePackage}" src="@/assets/images/arrow_down.png" class="arrow_down">
                    <ul v-if="isDropdownVisiblePackage" class="dropdown-menu">
                        <li
                            v-for="item in newTarrifs"
                            :key="item.package_name"
                            @mousedown.prevent="selectPackage(item.package_name, item.monthly_cost)"
                        >
                            {{ item.package_name }}
                        </li>
                    </ul>
                </div>
            </div>

            <div class="item">
                <h2>Срок оформления:</h2>
                <div class="dropdown" :style="{ pointerEvents : isYear ? 'none' : 'all'}">
                    <input
                        v-model="selectedTime"
                        type="text"
                        placeholder="Выберите срок*"
                        @focus="isDropdownVisibleTime = true"
                        @blur="hideDropdownTime"
                        readonly 
                    />
                    <!-- <img :class="{'rotated': isDropdo  wnVisibleTime}" src="@/assets/images/arrow_down.png" class="arrow_down"> -->
                    <ul v-if="isDropdownVisibleTime" class="dropdown-menu">
                        <li
                            v-for="(count, label) in times"
                            :key="label"
                            @mousedown.prevent="selectTime(label, count)"
                        >
                            {{ label }}
                        </li>
                    </ul>
                </div>
            </div>

            <div class="item">
                <h2>Стоимость:</h2>
                <div class="dropdown">
                    <input 
                        placeholder="Стоимость"
                        :value="summary"
                        readonly
                    />
                </div>
            </div>
            <div class="row" v-if="error">
                <img src="@/assets/images/cross.png" />
                <span class="error">{{ errorMessage }}</span>
            </div>
            <img src="@/assets/images/auth_image.png" class="left_image">
            <img src="@/assets/images/auth_image.png" class="right_image">
            <AppGoodButton :text="text1" @click="makePayment" class="btn" />
        </section>
    </div>
</template>

<script>
import { getUserInfo } from "@/services/user";
import AppGoodButton from "@/components/AppGoodButton.vue";
import { refreshToken } from "@/services/auth";
import { buyTariff, upgradeToLeader } from "@/services/cash";

export default {
    components: { AppGoodButton },
    props: {
        visibility1: Boolean,
        visibility2: Boolean,
        package: String,
        isGoodPayment: Boolean,
        tarrifs: Array,
        daysForBusiness: String
    },
    data() {
        return {
            userData: [],
            times: {
                "1 месяц": 1,
                "2 месяца": 2,
                "3 месяца": 3,
                "6 месяцев": 6,
                "1 год": 12,
            },
            isDropdownVisiblePackage: false,
            isDropdownVisibleTime: false,
            selectedPackage: "",
            selectedTime: "",
            currTime: 0,
            currPrice: 0,
            text1: "ОПЛАТИТЬ",
            error: false,
            currTarif: null,
            errorMessage: "",
            isYear: false,
            newTarrifs: [],
            disabled: false
        };
    },
    computed: {
        summary() {
            if (this.selectedPackage == "Leader") {
                const leader_pack = this.newTarrifs.find(item => item.package_name == "Leader");
                const business_pack = this.newTarrifs.find(item => item.package_name == "Business");
                console.log(leader_pack, business_pack, this.daysForBusiness);
                if (this.daysForBusiness != 0) {
                    return (leader_pack.monthly_cost * 12 - 4)  - Math.floor(+this.daysForBusiness / 30) * business_pack.monthly_cost;
                } else return 500;
            } 
            if (this.selectedPackage == "Business") return 300;
            return this.currTime * this.currPrice;
        }
    },
    watch: {
        package: {
            immediate: true,
            handler(newValue) {
                this.selectedPackage = newValue;
                this.currTarif = this.tarrifs.find(item => item.package_name == this.package);
                this.currPrice = this.currTarif?.monthly_cost;
                if (newValue == "Leader" || newValue == "Business") {
                    this.isYear = true;
                    this.currTime = 12;
                    this.selectedTime = "1 год";
                } else {
                    this.isYear = true;
                    this.currTime = 1;
                    this.selectedTime = "1 месяц";
                }
            }
        }
    },
    methods: {
        close() {
            if (this.visibility1) {
                this.$emit('update:visibility1', false);
                this.$emit('close');
            }
            this.error = false;
            // this.$emit('close');
        },
        hideDropdownPackage() {
            this.isDropdownVisiblePackage = false;
        },
        selectPackage(pack, price) {
            this.selectedPackage = pack;
            this.currPrice = price;
            this.currTarif = this.tarrifs.find(item => item.package_name == pack);
            if (this.selectedPackage == "Leader" || this.selectedPackage == "Business") {
                this.isYear = true;
                this.currTime = 12;
                this.selectedTime = "1 год";
            } else {
                this.isYear = true;
                this.currTime = 1;
                this.selectedTime = "1 месяц";
            }
            this.error = false;
            this.hideDropdownPackage();
        },
        hideDropdownTime() {
            this.isDropdownVisibleTime = false;
        }, 
        selectTime(label, count) {
            this.selectedTime = label;
            this.currTime = count;
            this.error = false;
            this.hideDropdownTime();
        },
        async makePayment() {
            if (this.userData.balance >= this.summary && !this.disabled) {
                this.disabled = true;
                let payment;
                console.log(this.daysForBusiness);
                if (this.daysForBusiness != 0) {
                    payment = await upgradeToLeader(this.summary, localStorage.getItem("token"));
                } else {
                    payment = await buyTariff(String(this.currTarif?.id), this.currTime, this.currTarif?.package_name, this.currTarif?.monthly_cost, localStorage.getItem("token"));
                }
                
                if (payment.status) {
                    this.$emit('update:isGoodPayment', true);
                    this.close();
                }
                else {
                    this.error = true;
                    this.errorMessage = payment.message[0].msg;
                }
                this.disabled = false;
            } else {
                this.error = true;
                this.errorMessage = `На вашем счету не хватает ${this.summary - this.userData.balance} USDT!`;
            }
        }
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
        this.userData = response;
        this.newTarrifs = this.tarrifs.filter(item => item.package_name != "Free");
        console.log(this.daysForBusiness);

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
        font-family: 'OpenSans';
    }
    h1 {
        text-align: center;
    }
    h2 {
        font-size: 18px;
        color: white;
        font-weight: bold;
    }
    .item {
        display: flex;
        flex-direction: column;
        row-gap: 10px;
        margin-top: 20px;
        position: relative;
    }
    .modal_wrapper {
        width: 100vw;
        height: 100vh;
        position: fixed;
        left: 0;
        top: 0;
        z-index: 900;
        background: #070a29;
        display: flex;
        justify-content: center;
        scrollbar-width: none;
        box-sizing: border-box;
        overflow-y: scroll;
        /* align-items: center; */
    }

    .modal {
        width: 760px;
        /* max-height: 500px; */
        align-self: center;
        border-radius: 10px;
        position: relative; /* Обеспечиваем позиционирование для псевдоэлемента */
        padding: 80px 50px;
        z-index: 2;
        overflow-y: scroll;
        scrollbar-width: none;
        row-gap: 20px;
        box-sizing: border-box;
        background: url("@/assets/images/background1.png");
        background-color: #141843;
        background-size: contain;
        background-position: center;
        background-blend-mode: soft-light;
        background-repeat: repeat-y;
        /* opacity: 0.25;  */
        background-size: 300%;
        filter: brightness(100%) contrast(90%);

        @media (max-width: 1000px) {
            width: 80vw;
        }
        @media (max-height: 700px) {
            align-self: flex-start;
        }
        @media (max-width: 650px) {
            width: 90vw;
            padding: 30px 15px;
        }
    }

    .modal::-webkit-scrollbar {
        width: 0;  
        height: 0;
    }

    .modal::-webkit-scrollbar-thumb {
        background: transparent;
    }
    .modal_wrapper::-webkit-scrollbar {
        width: 0;  
        height: 0;
    }

    .modal_wrapper::-webkit-scrollbar-thumb {
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
        height: 120%;
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
        font-size: 24px;
        font-family: 'OpenSans';
        font-weight: 400;
        line-height: 32.68px;
        color: white;
        text-wrap: wrap;
        /* text-align: center; */
        font-family: 'OpenSans';
        @media (max-width: 900px) {
            font-size: 20px;
        }
        @media (max-width: 650px) {
            font-size: 17px;
        }
    }
    .left_image {
        position: absolute;
        top: 38px;
        left: 22px;
        width: 97px;
        height: 97px;
        transform: rotate(-164deg);
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
        top: 251px;
        right: 4px;
        width: 219px;
        height: 219px;
        transform: rotate(11deg);
        @media (max-width: 900px) {
            width: 70px;
            height: 70px;
        }
        @media (max-width: 650px) {
            display: none;
        }
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

    .arrow_down {
        position: absolute;
        top: 23px;
        right: 23px;
        transition: transform 0.3s ease;
    }

    .arrow_down.rotated {
        transform: rotate(180deg);
    }

    .dropdown-menu {
        position: absolute;
        width: 100%;
        border: 1px solid white;
        border-radius: 10px;
        max-height: 200px;
        overflow-y: scroll;
        list-style: none;
        margin: 0;
        padding: 0;
        z-index: 1000;
        color: rgba(255, 255, 255, 0.5);
        font-size: 20px;
        font-weight: normal;
        letter-spacing: 1px;
        scrollbar-width: none;
        z-index: 15;
    }
    .dropdown::-webkit-scrollbar {
        width: 0;  
        height: 0;
    }

    .dropdown::-webkit-scrollbar-thumb {
        background: transparent;
    }

    .dropdown-menu li {
        padding: 20px;
        cursor: pointer;
        border-bottom: 1px solid white;
        background: #070a29;
        font-family: 'OpenSans'
    }

    .dropdown-menu li:hover {
        background: #0c103e;
    }
    .dropdown {
        position: relative;
        width: 360px;
        @media (max-width: 500px) {
            width:70vw;
        }
    }
    .error {
        color: red;
    }
    .row {
        margin-top: 20px;
        display: flex;
        align-items: center;
        column-gap: 10px;
    }
    .row img {
        width: 30px;
        height: 30px;
        object-fit: cover;
        object-position: center;
    }
    .row span {
        font-size: 18px;
    }
    .btn {
        margin-top: 20px;
        position: relative;
    }
</style>