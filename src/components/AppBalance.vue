<template>
    <section class="balance">
        <div class="switch" v-if="windowWidth > 650">
            <span
                v-for="(item, index) in listSwtich"
                :key="index"
                :class="{ active: activeIndex === item.index }" 
                @click="setActive(item.index)"
            >{{ item.name }}</span>
        </div>
        <div class="switch_mob" v-if="windowWidth <= 650">
            <span class="active" @click="openDrowdown">
                {{ listSwtich[activeIndex].name }}
                <img src="@/assets/images/arrow_down.png" 
                    class="arrow_down"
                    :class="{ rotated: isDropdown }"
                >
            </span>
            <div class="dropdown" v-if="isDropdown">
                <span
                    v-for="(item, index) in filteredListSwtich"
                    :key="index"
                    class="item_mob"
                    @click="setActive(item.index)"
                >{{ item.name }}</span>
            </div>
        </div>
            <AppBalancePutMoney v-if="activeIndex === 0" :userData="userData" :windowWidth="windowWidth" />
            <AppBalanceCashOut v-if="activeIndex === 1" :userData="userData" :windowWidth="windowWidth" />
            <AppBalanceSend v-else-if="activeIndex === 2" :userData="userData" :windowWidth="windowWidth" />
            <AppBalanceHistory v-else-if="activeIndex === 3" :userData="userData" :windowWidth="windowWidth" />
    </section>
</template>

<script>
    import AppBalanceCashOut from '@/components/AppBalanceCashOut.vue';
    import AppBalancePutMoney from '@/components/AppBalancePutMoney.vue';
    import AppBalanceHistory from '@/components/AppBalanceHistory.vue';
    import AppBalanceSend from '@/components/AppBalanceSend.vue';
    export default {
        components: { AppBalanceCashOut, AppBalancePutMoney, AppBalanceSend, AppBalanceHistory },
        props: { 
            userData: Object,
            windowWidth: Number
        },
        data() {
            return {
                listSwtich: [
                    {
                        index: 0,
                        name: "Пополнить баланс"
                    },
                    {
                        index: 1,
                        name: "Вывод средств"
                    },
                    {
                        index: 2,
                        name: "Перевод средств"
                    },
                    {
                        index: 3,
                        name: "Финансовая история"
                    },
                ],
                activeIndex: 0,
                isDropdown: false,
                helpFlag: false
            }
        },
        computed: {
            filteredListSwtich() {
                return this.listSwtich.filter((_, index) => index != this.activeIndex);
            }
        },
        methods: {
            setActive(index) {
                this.activeIndex = index;
                this.isDropdown = false;
            },
            openDrowdown() {
                this.isDropdown = !this.isDropdown;
                if (this.isDropdown) document.addEventListener("click", this.handleClickOutside)
                else document.removeEventListener("click", this.handleClickOutside);
            },
            handleClickOutside(event) {
                const path = event.composedPath();
                const wrapperNavMobile = this.$el.querySelector(".switch_mob");
                console.log(!path.includes(wrapperNavMobile), this.helpFlag);
                if (!path.includes(wrapperNavMobile) && this.helpFlag) {
                    this.isDropdown = false;
                    this.helpFlag = false;
                }
                this.helpFlag = true;
            },
        }
    };
</script>

<style scoped>
    .active {
        background: #7023EC;
        font-weight: bold;
        position: relative;
        cursor: pointer;
        @media (max-width: 650px) {
            font-size: 16px;
            text-align: start !important;
        }
    }
    .arrow_down {
        position: absolute;
        top: 18px;
        right: 13px;
        width: 13px;
        height: 13px;
        transition: .2s ease-in;
    }
    .rotated {
        transform: rotate(180deg);
        transition: .2s ease-in;
    }
    .balance {
        width: 100%;
        display: flex;
        flex-direction: column;
        row-gap: 50px;
        /* z-index: 4; */
    }
    .switch {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
    }
    .switch_mob {
        width: 100%;
        display: flex;
        flex-direction: column;
        position: relative;
    }
    .dropdown {
        position: absolute;
        top: 100%;
        width: 100%;
        border: 1px solid #7023EC;
        border-top: none;
        max-height: 200px;
        overflow-y: scroll;
        list-style: none;
        margin: 0;
        padding: 0;
        z-index: 1000;
        color: white;
        font-size: 20px;
        font-weight: normal;
        letter-spacing: 1px;
        scrollbar-width: none;
        z-index: 15;
        background: #1B1E3D;
        display: flex;
        flex-direction: column;
    }
    span {
        width: 100%;
        height: 40px;
        color: white;
        font-size: 18px;
        font-family: 'OpenSans';
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: .1s ease-in;
        text-align: center;
        @media (max-width: 1300px) {
            font-size: 16px;
        }
        @media (max-width: 1100px) {
            font-size: 14px;
            height: 50px;
            padding: 5px 10px;
        }
        @media (max-width: 700px) {
            height: 50px;
        }
        @media (max-width: 650px) {
            text-align: start;
        }
    }
    .item_mob {
        border-bottom: 1px solid white;
        padding: 10px;
        text-align: start;
        padding-left: 10px;
        font-size: 16px !important;
    }
    .switch_mob::-webkit-scrollbar {
        width: 0;  
        height: 0;
    }

    .switch_mob::-webkit-scrollbar-thumb {
        background: transparent;
    }
</style>