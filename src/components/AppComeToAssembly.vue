<template>
    <AppModal 
        :title="title" 
        :message="msg" 
        :visibility1="isModal"
        @update:visibility1="isModal = $event"
    />
    <section class="come">
        <h1>Рекламная лента</h1>
        <span>Тысячи пользователей с бизнес интересами ежедневно и многократно посещают кабинет Intelektaz. У нас точно есть ваши клиенты. Покажите им свое предложение по самой низкой цене:</span>
        <span class="error" v-if="isError">{{ errorMsg }}</span>
        <div class="content">
            <div class="prices">
                <div class="row" v-for="(tarrif, index) in tarrifs" :key="index">
                    <span>{{ tarrif }}</span>
                    <strong><span>{{ prices[index] }}</span></strong>
                </div>
            </div>
            <div class="group" v-if="userInfo.group">
                <div class="item">
                    <img :src="userInfo.group.group_photo">
                    <div class="text_block">
                        <span>{{ userInfo.group.group_name }}</span>
                    </div>
                </div>
                <AppGoodButton :text="text1" class="btn" @click="comeToAss" />
            </div>
        </div>
    </section>
</template>

<script>
    import AppGoodButton from "@/components/AppGoodButton.vue";
    import { getUserInfo } from "@/services/user";
    import { setAdds } from "@/services/add";
    import { refreshToken } from "@/services/auth";
    import AppModal from '@/components/AppModal.vue';

    export default {
        components: { AppGoodButton, AppModal },
        data() {
            return {
                tarrifs: ["Leader, Business", "VIP", "Start, Standart", "Free"],
                prices: [1, 1, 1.5, 2, 2, 3],
                text1: "ПОПАСТЬ В ЛЕНТУ",
                userInfo: [],
                isModal: false,
                title: "",
                msg: "",
                errorMsg: "",
                isError: false,
                price: 3
            }
        },
        async created() {
            const user = await getUserInfo(localStorage.getItem("token"));
            if (!user) {
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
            this.userInfo = user;
        },
        methods: {
            async comeToAss() {
                if (!this.userInfo.group.group_link) {
                    this.isError = true;
                    this.errorMsg = "У вас не привязана группа вк!";
                    return;
                }
                const tariff = this.userInfo.packages[this.userInfo.packages.length - 1].package_name;
                switch (tariff) {
                    case "Leader" || "Business":
                        this.price = 1;
                        break;
                    case "VIP":
                        this.price = 1.5;
                        break;
                    case "Start" || "Standart":
                        this.price = 2;
                        break;
                    default: 
                        this.price = 3;
                        break;
                }
                if (this.userInfo.balance < this.price) {
                    this.isError = true;
                    this.errorMsg = "Не хватает средств на балансе!";
                    return;
                }
                this.isError = false;
                // имена функций я, конечно, придумывать умею ;)
                const resp = await setAdds(this.userInfo.group.group_link, this.userInfo.vk_id);
                this.isModal = true;
                this.title = resp.status ? "УСПЕШНО!" : "ОШИБКА!";
                this.msg = resp.status ? "Ваша группа добавлена в рекламную ленту." : "Не удалось добавить группу в рекламную ленту.";
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
    }
    span {
        font-size: 18px;
        color: white;
        font-family: 'OpenSans';
    }
    .content {
        display: flex;
        justify-content: space-between;
    }
    .prices {
        display: flex;
        flex-direction: column;
        row-gap: 10px;
    }
    .row {
        display: flex;
        justify-content: space-between;
        column-gap: 60px;
    }
    .row span {
        font-size: 20px;
        text-align: start;
    }
    .group {
        display: flex;
        align-items: center;
        column-gap: 50px;
    }
    .btn {
        width: 189px;
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
        @media (max-width: 600px) {
            width: 100px;
            height: 100px;
        }
        @media (max-width: 360px) {
            width: 120px;
            height: 120px;
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
        color: red;
    }
</style>