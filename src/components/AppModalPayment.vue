<template>
    <div v-if="visibility1" class="modal_wrapper" id="modal_wrapper">
        <section class="modal">
            <!-- <div class="modal-background"></div> -->
            <img src="@/assets/images/close.png" class="close" @click="close">
            <h1>ОПЛАТА</h1>
            <span>Баланс: {{ userData?.balance?.toFixed(2)  }}</span>
            
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
            <span class="error" v-if="error"> <img src="@/assets/images/cross.png" />{{ errorMessage }}</span>
            <img src="@/assets/images/auth_image.png" class="left_image">
            <img src="@/assets/images/auth_image.png" class="right_image">
            <AppGoodButton :text="text1" @click="makePayment" class="btn" />
        </section>
    </div>
</template>

<script>
import AppGoodButton from "@/components/AppGoodButton.vue";
import { buyTariff, upgradeToLeader } from "@/services/cash";

export default {
    components: { AppGoodButton },
    props: {
        visibility1: Boolean,
        visibility2: Boolean,
        package: String,
        isGoodPayment: Boolean,
        tarrifs: Array,
        daysForBusiness: String,
        userData: Object
    },
    data() {
        return {
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
            disabled: false,
        };
    },
    computed: {
        summary() {
            if (this.selectedPackage == "Leader") {
                const leader_pack = this.newTarrifs.find(item => item.package_name == "Leader");
                const business_pack = this.newTarrifs.find(item => item.package_name == "Business");
                console.log("Я в ЛИДЕРЕ", leader_pack, business_pack, this.daysForBusiness);
                if (this.daysForBusiness != 0) {
                    return Math.abs((leader_pack.monthly_cost * 12 - 4)  - Math.floor(+this.daysForBusiness / 31) * business_pack.monthly_cost);
                } else return 500;
            } 
            if (this.selectedPackage == "Business") return 300;
            console.log("Я В ЖОПЕ");
            return this.currTime * this.currPrice;
        }
    },  
    // (42 * 12 - 4) - (1094 / 30) * 25 = 
    //  Math.abs((leader_pack.monthly_cost * 12 - 4)  - Math.floor(+this.daysForBusiness / 30)) * business_pack.monthly_cost;
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
        },
        tarrifs: {
            handler(val) {
                this.newTarrifs = val.filter(item => item.package_name != "Free");
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
                if (!this.disabled) {
                    this.error = true;
                    this.errorMessage = `На вашем счету не хватает ${this.summary - this.userData.balance.toFixed(2)} USDT!`;
                }
            }
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
        @media (max-width: 650px) {
            font-size: 14px;
        }
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
        @media (max-width: 650px) {
            width: 90vw;
            padding: 30px 15px;
            padding-top: 40px;
            display: flex;
            flex-direction: column;
            row-gap: 0px;
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
        @media (max-width: 650px) {
            font-size: 32px;
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
            font-size: 14px;
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
            width: 53px;
            height: 53px;
            top: 14px;
            left: 28px;
            transform: rotate(-140.31deg);
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
        @media (max-width: 650px) {
            height: 50px;
        }
    }

    .arrow_down {
        position: absolute;
        right: 23px;
        width: 13px;
        height: 13px;
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
        display: flex;
        align-items: center;
        @media (max-width: 650px) {
            width: 100%;
        }
    }
    .error {
        color: #FF6666;
        display: flex;
        align-items: center;
        font-size: 14px;
    }
    .error img {
        width: 20px;
        height: 20px;
        margin-right: 10px;
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
        @media (max-width: 650px) {
            width: 190px;
            align-self: center;
        }
    }
</style>