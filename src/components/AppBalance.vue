<template>
    <section class="balance">
        <div class="switch">
            <span
                v-for="(item, index) in listSwtich"
                :key="index"
                :class="{ active: activeIndex === index }" 
                @click="setActive(index)"
            >{{ item }}</span>
        </div>
            <AppBalancePutMoney v-if="activeIndex === 0" />
            <AppBalanceCashOut v-if="activeIndex === 1" />
            <AppBalanceSend v-else-if="activeIndex === 2" />
            <!-- <AppBalanceHistory v-else-if="activeIndex === 3" /> -->
    </section>
</template>

<script>
    import AppBalanceCashOut from '@/components/AppBalanceCashOut.vue';
    import AppBalancePutMoney from '@/components/AppBalancePutMoney.vue';
    import AppBalanceSend from '@/components/AppBalanceSend.vue';
    export default {
        components: { AppBalanceCashOut, AppBalancePutMoney, AppBalanceSend },
        data() {
            return {
                listSwtich: ["Пополнить баланс", "Вывод средств", "Перевод средств", "Финансовая история"],
                activeIndex: 0
            }
        },
        methods: {
            setActive(index) {
                this.activeIndex = index;
            },
        }
    };
</script>

<style scoped>
    .active {
        background: #7023EC;
        font-weight: bold;
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
    span {
        width: 100%;
        height: 40px;
        color: white;
        font-size: 18px;
        font-family: 'OpenSans';
        cursor: pointer;
        text-align: center;
        align-content: center;
        transition: .1s ease-in;
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
        @media (max-width: 500px) {
            font-size: 12px;
        }
        @media (max-width: 360px) {
            font-size: 10px;
        }
    }
</style>