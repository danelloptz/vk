<template>
    <AppModal 
        :title="title" 
        :message="msg" 
        :visibility1="isModal"
        @update:visibility1="isModal = $event"
        @close="reload"
    />
    <section class="come">
        <h1>Рекламная лента</h1>
        <span>Тысячи пользователей с бизнес интересами ежедневно и многократно посещают кабинет Intelektaz. У нас точно есть ваши клиенты. Покажите им свое предложение по самой низкой цене:</span>
        <div class="content">
            <div class="prices">
                <div class="row" v-for="(tarrif, index) in tarrifs" :key="index">
                    <span>{{ tarrif }}</span>
                    <strong><span>{{ prices[index] }} USDT</span></strong>
                </div>
            </div>
            <div class="group" v-if="userData.group">
                <div class="item">
                    <img :src="userData.group.group_photo">
                    <div class="text_block">
                        <span>{{ userData.group.group_name }}</span>
                    </div>
                </div>
                <AppGoodButton :text="isError ? text2 : text1" class="btn" @click="comeToAss" />
            </div>
        </div>
        <span class="error" v-if="isError"><img src="@/assets/images/cross2.png" /> {{ errorMsg }}</span>
    </section>
</template>

<script>
    import AppGoodButton from "@/components/AppGoodButton.vue";
    import { setAdds } from "@/services/add";
    import { getConfig } from "@/services/config";
    import AppModal from '@/components/AppModal.vue';

    export default {
        components: { AppGoodButton, AppModal },
        props: { userData: Object },
        data() {
            return {
                tarrifs: ["Leader, Business", "VIP", "Start, Standart", "Free"],
                text1: "ПОПАСТЬ В ЛЕНТУ",
                text2: "ПОПОЛНИТЬ БАЛАНС",
                isModal: false,
                title: "",
                msg: "",
                errorMsg: "",
                isError: false,
                price: 3,
                priceData: null,
                disabled: false
            }
        },
        async created() {
            this.priceData = await getConfig("groups_add_price", localStorage.getItem("token"));
        },
        computed: {
            prices() {
                return [this.priceData.leader_business, 
                        this.priceData.vip, 
                        this.priceData.start_standard, 
                        this.priceData.free];
            }
        },  
        methods: {
            async comeToAss() {
                // имена функций я, конечно, придумывать умею ;)
                if (this.disabled) return;
                if (this.isError) this.$emit('open-balance');
                this.disabled = true;
                if (!this.userData.group.group_link) {
                    this.isError = true;
                    this.errorMsg = "У вас не привязана группа вк!";
                    return;
                }
                const tariff = this.userData.packages[this.userData.packages.length - 1].package_name;
                switch (tariff) {
                    case "Leader":
                        this.price = 1;
                        break;
                    case "Business":
                        this.price = 1;
                        break;
                    case "VIP":
                        this.price = 1.5;
                        break;
                    case "Start":
                        this.price = 2;
                        break;
                    case "Standard":
                        this.price = 2;
                        break;
                    default: 
                        this.price = 3;
                        break;
                }
                if (this.userData.balance < this.price) {
                    this.isError = true;
                    this.errorMsg = `Недостаточно средств. Не хватает ${this.price - this.userData.balance.toFixed(2)} USDT. Пополните баланс`;
                    this.disabled = false;
                    return;
                }
                this.isError = false;
                const resp = await setAdds(this.userData.group.group_link, this.userData.vk_id);
                this.isModal = true;
                this.title = resp.status ? "УСПЕШНО!" : "ОШИБКА!";
                this.msg = resp.status ? "Ваша группа добавлена в рекламную ленту." : "Не удалось добавить группу в рекламную ленту.";
                this.disabled = false;
            },
            reload() {
                window.location.reload();
            }
        }
    };
</script>

<style scoped>
    .come {
        width: 100%;
        display: flex;
        flex-direction: column;
        row-gap: 25px;
    }
    h1 {
        font-size: 24px;
        color: white;
        font-family: 'OpenSans';
        @media (max-width: 650px) {
            font-size: 16px;
        }
    }
    span {
        font-size: 18px;
        color: white;
        font-family: 'OpenSans';
        @media (max-width: 650px) {
            font-size: 14px;
        }
    }
    .content {
        display: flex;
        justify-content: space-between;
        @media (max-width: 650px) {
            flex-direction: column;
            row-gap: 24px;
        }
    }
    .prices {
        display: flex;
        flex-direction: column;
        row-gap: 10px;
        @media (max-width: 650px) {
            max-width: 220px;
        }
    }
    .row {
        display: flex;
        justify-content: space-between;
        column-gap: 60px;
    }
    .row span {
        font-size: 20px;
        text-align: start;
        @media (max-width: 650px) {
            font-size: 14px;
        }
    }
    .group {
        display: flex;
        align-items: center;
        column-gap: 50px;
        @media (max-width: 650px) {
            flex-direction: column;
            row-gap: 20px;
            align-self: center;
        }
    }
    .btn {
        width: 189px;
        @media (max-width: 650px) {
            width: 200px;
            height: 40px;
        }
    }

    .item {
        width: 150px;
        height: 150px;
        border-radius: 10px;
        position: relative;
        padding: 5px;
        display: flex;
        align-items: end;
        cursor: pointer;
        @media (max-width: 650px) {
            width: 200px;
            height: 200px;
        }
    }
    .item img {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
        border-radius: 10px;
        opacity: 0.8;
        z-index: 5;
        transition: .3s;
    }
    .item img:hover {
        opacity: 1;
    }
    .text_block {
        background: #1b1e3d7b;
        width: 100%;
        padding: 6px;
        border-radius: 10px;
        z-index: 6;
    }
    .text_block span {
        font-size: 14px;
        color: white;
        font-family: 'OpenSans';
    }
    .error {
        color: #FF6666;
        display: flex;
        column-gap: 10px;
        align-items: center;
    }
    .error img {
        width: 20px;
        height: 20px;
    }
</style>