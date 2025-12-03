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
            <div class="group">
                <div class="item">
                    <img :src="banner">
                    <div class="text_block">
                        <span>{{ label }}</span>
                    </div>
                </div>
                <AppGoodButton :text="isError ? text2 : text1" class="btn" @click="comeToAss" />
            </div>
        </div>
        <span class="error" v-if="isError"><img src="@/assets/images/cross2.png" /> {{ errorMsg }}</span>
        <div class="copy_from">
            <span><strong>Копировать баннер и название с:</strong></span>
            <div class="copy_from_row">
                <div class="checkbox-wrapper-18">
                    <div class="round">
                        <input type="checkbox" :id="`checkbox-20`" v-model="tg" @click="changePlatform('tg')" />
                        <label :for="`checkbox-20`"></label>
                    </div>
                </div>
                <span>Telgram</span>
            </div>
            <div class="copy_from_row">
                <div class="checkbox-wrapper-18">
                    <div class="round">
                        <input type="checkbox" :id="`checkbox-21`" v-model="vk" @click="changePlatform('vk')" />
                        <label :for="`checkbox-21`"></label>
                    </div>
                </div>
                <span>Вконтакте</span>
            </div>
        </div>
    </section>
</template>

<script>
    import AppGoodButton from "@/components/AppGoodButton.vue";
    import { setAdds, setTgAdds } from "@/services/add";
    import { getConfig } from "@/services/config";
    import AppModal from '@/components/AppModal.vue';
    import { getTgGroupInfo, getTelegramLinks } from '@/services/tg';

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
                disabled: false,
                groupTgInfo: null,
                tg_links: null ,
                tg_group: null,
                tg: false,
                vk: false,
                banner: null,
                label: null
            }
        },
        async created() {
            this.priceData = await getConfig("groups_add_price", localStorage.getItem("token"));
            this.groupTgInfo = await getTgGroupInfo(localStorage.getItem('token'));
            if (this.userData?.tg_id) {
                this.tg_links = await getTelegramLinks(localStorage.getItem('token'));
                this.tg_group = this.tg_links.channel_tg_link;
                this.tg = true;
                this.banner = this.groupTgInfo.group_photo;
                this.label = this.groupTgInfo.group_name;
            } else {
                this.vk = true;
                this.banner = this.userData.group.group_photo;
                this.label = this.userData.group.group_name;
            }
            
        },
        computed: {
            prices() {
                return [this.priceData.leader_business, 
                        this.priceData.vip, 
                        this.priceData.start_standard, 
                        this.priceData.free];
            },
        },  
        methods: {
            // banner() {
            //     return this.tg ? this.groupTgInfo.group_photo : this.userData.group.group_photo;
            // },
            // label() {
            //     return this.tg ? this.groupTgInfo.group_name : this.userData.group.group_name;
            // },
            changePlatform(platform) {
                if (platform == 'tg') {
                    if (!this.userData.tg_id) {
                        this.isError = true;
                        this.errorMsg = 'У вас не подключена эта платформа.';
                        return;
                    }
                    this.tg = true;
                    this.vk = false;
                    this.banner = this.groupTgInfo.group_photo;
                    this.label = this.groupTgInfo.group_name;
                } else {
                    if (!this.userData.vk_id) {
                        this.isError = true;
                        this.errorMsg = 'У вас не подключена эта платформа.';
                        return;
                    }
                    this.tg = false;
                    this.vk = true;
                    this.banner = this.userData.group.group_photo;
                    this.label = this.userData.group.group_name;
                }
            },
            async comeToAss() {
                // имена функций я, конечно, придумывать умею ;)
                if (this.disabled) return;
                if (this.isError) this.$emit('open-balance');
                this.disabled = true;
                if (this.vk && !this.userData.group?.group_link) {
                    this.isError = true;
                    this.errorMsg = "У вас не привязана группа вк!";
                    return;
                }
                if (this.tg && !this.tg_links.channel_tg_link) {
                    this.isError = true;
                    this.errorMsg = "У вас не привязан телеграмм канал!";
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
                const resp = this.tg ? await setTgAdds(this.userData.id, this.groupTgInfo.group_id) : await setAdds(this.banner, this.userData.vk_id);
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
    .checkbox-wrapper-18 .round {
        position: relative;
    }

    .checkbox-wrapper-18 .round label {
        background-color: none;
        border: 1px solid white;
        cursor: pointer;
        height: 23px;
        width: 23px;
        display: block;
    }

    .checkbox-wrapper-18 .round label:after {
        border: 3px solid #66bb6a;
        border-top: none;
        border-right: none;
        content: "";
        height: 6px;
        left: 5px;
        opacity: 0;
        position: absolute;
        top: 3px;
        transform: rotate(-45deg);
        width: 18px;
    }

    .checkbox-wrapper-18 .round input[type="checkbox"] {
        visibility: hidden;
        display: none;
        opacity: 0;
    }

    .checkbox-wrapper-18 .round input[type="checkbox"]:checked + label {
        background-color: none;
        border-color: white;
    }

    .checkbox-wrapper-18 .round input[type="checkbox"]:checked + label:after {
        opacity: 1;
    }
    .copy_from {
        display: flex;
        flex-direction: column;
    }
    .copy_from span {
        font-size: 18px;
        color: white;
        font-family: 'OpenSans';
    }
    .copy_from_row {
        display: flex;
        column-gap: 10px;
        align-items: center;
    }
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