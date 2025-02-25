<template>
    <AppMain :links="isLinks" v-if="isLinks" />
    <section class="struct" v-if="!isLinks">
        <div class="user">
            <img :src="userData.avatar">
            <div class="user_col">
                <div class="user_row">
                    <h2>{{ `${userData.first_name} ${userData.last_name}` }}</h2>
                    <span v-if="userData.package_name != 'Free'">{{ userData.package_name }}</span>
                </div>
                <span>ID: {{ userData.vk_id }}</span>
            </div>
        </div>
        <div class="switch">
            <span
                v-for="(item, index) in listSwtich"
                :key="index"
                :class="{ active: activeIndex === index }"
                @click="setActive(index)"
            >{{ item }}</span>
            <img src="@/assets/images/eye.png" class="eye" v-if="showNums" @click="switchShowNums">
            <img src="@/assets/images/close_eye.png" class="eye" v-if="!showNums" @click="switchShowNums">
        </div>
        <div class="stats">
            <div class="stats_row first">
                <div class="stats_item" v-for="(item, index) in maskedStats.slice(0, 3)" :key="index">
                    <img :src="require(`@/assets/images/${item.img}`)">
                    <div class="item_col">
                        <h3>{{ item.num }}</h3>
                        <span>{{ item.text }}</span>
                    </div>
                </div>
            </div>
            <div class="stats_row second">
                <div class="stats_item short" v-for="(item, index) in maskedStats.slice(3, 7)" :key="index">
                    <img :src="require(`@/assets/images/${item.img}`)">
                    <div class="item_col">
                        <h3>{{ item.num }}</h3>
                        <span>{{ item.text }}</span>
                    </div>
                </div>
            </div>
        </div>
        <AppGoodButton :text="text1" @click="openLinks" />

        <div class="text_row">
            <div class="text_row_item">
                <h2>Оборот: </h2>
                <span>5340</span>
            </div>
            <div class="text_row_item">
                <h2>Первая линия / всего: </h2>
                <span>51 / 131</span>
            </div>
        </div>
        <div class="search">
            <img src="@/assets/images/search.png">
            <input
                class="search_input"
                v-model="search"
                placeholder="Введите ID"
                type="text"
            />
            <AppGoodButton :text="text2" class="btn" @click="searchId" />
            <AppBadButton :text="text3" class="btn" @click="backup"  />
        </div>
        <AppStructureBinar v-if="binarTree && !notFound" :node="binarTree" :lay="1" @nextUser="next" />
        <span class="warning" v-if="notFound">Пользователя с таким ID нет вашей структуре!</span>
    </section>
</template>

<script>
import { getUserInfo } from "@/services/user";
import { getTree } from "@/services/user";
import AppGoodButton from "@/components/AppGoodButton.vue";
import AppBadButton from "@/components/AppBadButton.vue";
import AppMain from "@/components/AppMain.vue";
import AppStructureBinar from "@/components/AppStructureBinar.vue";
import { refreshToken } from "@/services/auth";

export default {
    components: { AppGoodButton, AppBadButton, AppMain, AppStructureBinar },
    data() {
        return {
            userData: [],
            listSwtich: ["Линейная структура", "Бинарная структура"],
            activeIndex: 0,
            showNums: true,
            text1: "РЕФЕРАЛЬНЫЕ ССЫЛКИ",
            text2: "ПОИСК",
            text3: "СБРОС",
            stats_data: [
                { "img": "marketing.png", "num": 10, "text": "Клиентский маркетинг, (ур.)" },
                { "img": "binar.png", "num": 10, "text": "Бинар, (%)" },
                { "img": "stonks.png", "num": 10000, "text": "До следующего ранг. бонуса, (USDT)" },
                { "img": "rang.png", "num": 0, "text": "Ранг" },
                { "img": "bonus.png", "num": 5, "text": "Matching bonus, (ур.)" },
                { "img": "global_bonus.png", "num": 0, "text": "Глобальный бонус, (пул)" },
                { "img": "fast_start.png", "num": 25, "text": "Быстрый старт, дней осталось" }
            ],
            isLinks: false,
            binarTree: null,
            nextUser: false,
            users: [],
            search: "",
            notFound: false,
        };
    },
    computed: {
        maskedStats() {
            return this.stats_data.map(item => ({
                ...item,
                num: this.showNums ? item.num : '*'.repeat(item.num.toString().length)
            }));
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

        await this.next(this.userData.vk_id);

        console.log(this.binarTree);
    },
    methods: {
        setActive(index) {
            this.activeIndex = index;
        },
        switchShowNums() {
            this.showNums = !this.showNums;
        },
        openLinks() {
            this.isLinks = true;
        },
        async next(vk_id) {
            console.log("сработал", vk_id);
            const tree = await getTree(vk_id);
            this.binarTree = tree;
            this.getAllId(this.binarTree);
            console.log(this.users);
        },
        getAllId(node) {
            if (!node.vk_id) return
            else this.users.push(node.vk_id);

            if (node.left_leg) this.getAllId(node.left_leg);
            if (node.right_leg) this.getAllId(node.right_leg);
        },
        async searchId() {
            if (this.users.includes(+this.search)) {
                this.notFound = false;
                this.binarTree = await getTree(+this.search);
            } else {
                this.notFound = true;
            }
        },
        async backup() {
            this.notFound = false;
            this.binarTree = await getTree(this.userData.vk_id);
        }
    }
};
</script>

<style scoped>
    .struct {
        display: flex;
        flex-direction: column;
        row-gap: 30px;
    }

    .user {
        display: flex;
        column-gap: 20px;
        align-items: center;
    }

    .user img {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        object-fit: cover;
        outline: 1px solid white;
        outline-offset: 10px;
    }

    .user_col {
        display: flex;
        flex-direction: column;
        row-gap: 8px;
    }

    .user_row {
        display: flex;
        column-gap: 20px;
        align-items: center;
    }

    .user_row h2 {
        font-size: 16px;
        color: white;
        font-family: 'OpenSans';
    }

    .user_row span {
        color: white;
        font-size: 14px;
        padding: 0px 18px;
        background: #7023EC;
        font-family: 'OpenSans';
        border-radius: 5px;
    }

    .user_col span {
        color: white;
        font-size: 14px;
        font-family: 'OpenSans';
    }

    .switch {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        position: relative;
    }

    .eye {
        width: 30px;
        height: 30px;
        object-position: center;
        object-fit: cover;
        cursor: pointer;
        position: absolute;
        right: 0;
        top: 10%;
    }

    .switch span {
        width: 100%;
        height: 40px;
        color: white;
        font-size: 18px;
        font-family: 'OpenSans';
        cursor: pointer;
        text-align: center;
        align-content: center;
        transition: .1s ease-in;
    }

    .active {
        background: #7023EC;
        font-weight: bold;
    }

    .stats {
        display: flex;
        flex-direction: column;
        row-gap: 17px;
    }

    .stats_row {
        display: grid;
        gap: 24px;
    }

    .stats_row.first {
        grid-template-columns: repeat(3, 1fr);
        @media (max-width: 900px) {
            grid-template-columns: repeat(2, 1fr);
        }
        @media (max-width: 600px) {
            grid-template-columns: repeat(1, 1fr);
        }
    }

    .stats_row.second {
        grid-template-columns: repeat(4, 1fr);
        @media (max-width: 900px) {
            grid-template-columns: repeat(2, 1fr);
        }
        @media (max-width: 600px) {
            grid-template-columns: repeat(1, 1fr);
        }
    }

    .stats_item {
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 20px 10px;
        background: #2F3251;
        border-radius: 10px;
    }

    .stats_item img {
        width: 75px;
        height: 75px;
        object-fit: cover;
    }

    .item_col {
        display: flex;
        flex-direction: column;
        row-gap: 15px;
    }

    .item_col h3 {
        font-size: 50px;
        font-family: 'OpenSans';
        font-weight: normal;
        color: white;
    }

    .item_col span {
        font-size: 12px;
        font-family: 'OpenSans';
        font-weight: normal;
        color: white;
    }

    .text_row {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .text_row_item{
        display: flex;
        column-gap: 20px;
        align-items: center;
    }
    .text_row_item h2 {
        font-size: 20px;
        font-family: 'OpenSans';
        color: white;
    }
    .text_row_item span {
        font-size: 20px;
        font-family: 'OpenSans';
        color: white;
    }

    .search {
        display: flex;
        width: 100%;
        align-items: center;
        column-gap: 18px;
    }
    .search img {
        width: 35px;
        height: 35px;
        object-fit: cover;
        object-position: center;
    }
    .search input {
        width: 430px;
        background: none;
        border: none;
        border-bottom: 1px solid rgba(255, 255, 255, 0.5);
        font-size: 16px;
        color: white;
        padding: 10px;
        font-family: 'OpenSans';
    }
    .search input:focus {
        outline: none;
    }
    .btn {
        width: 130px;
    }
    .warning {
        color: white;
        font-size: 16px;
        font-family: 'OpenSans';
    }
</style>