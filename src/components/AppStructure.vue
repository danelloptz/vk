<template>
    <AppModal 
        :title="title" 
        :message="msg" 
        :visibility1="isChangeLegModal"
        @update:visibility1="isChangeLegModal = $event"
    />
    <AppMain :links="isLinks" v-if="isLinks" :userData="userData" />
    <section class="struct" v-if="!isLinks">
        <div class="user">
            <img :src="userData.avatar">
            <div class="user_col">
                <div class="user_row">
                    <h2>{{ `${userData.name}` }}</h2>
                    <span v-if="userData?.packages[userData?.packages.length - 1]?.package_name != 'Free'">{{ userData?.packages[userData?.packages.length - 1]?.package_name }}</span>
                </div>
                <span>ID: {{ userData.vk_id }}</span>
            </div>
        </div>
        <div class="switch_wrapper">
            <div class="switch">
                <span
                    v-for="(item, index) in listSwtich"
                    :key="index"
                    :class="{ active: activeIndex === index }"
                    @click="setActive(index)"
                >{{ item }}</span>
            </div>
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
                <h2>Первая линия / всего: </h2>
                <span>{{ maskedStructInfo.first_line_total }} / {{ maskedStructInfo.total_referrals }}</span>
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
        <div class="legs" v-if="activeIndex == 1">
            <div class="left">
                <div class="circle" :class="{ binar_active: struct_info.qualification }"></div>
                <div class="col">
                <h2>Бинарная квалификация</h2>
                <span v-if="!struct_info.qualification">Не активна</span>
                <span v-else>Активна</span>
                </div>
            </div>
            <div class="right">
                <div class="legs_item"  
                v-for="(leg, index) in legs" 
                :key="leg.label"
                @click="changeActiveLeg(index, leg.value)"
                >
                <div class="check" :class="{ activeBinar: (leg_index == index && !userData.auto_current_leg) || (userData.auto_current_leg && leg.value == 'auto') }"></div>
                    <span>{{ leg.label }}</span>
                </div>
                <AppGoodButton :text="text4" class="btn" @click="setLeg"/>
            </div>
        </div>
        <AppStructureBinar 
            v-if="binarTree && !notFound && activeIndex == 1" 
            :isRoot="true" 
            :user="userData" 
            :activation="struct_info.qualification" 
            :current_leg="userData.current_leg" 
            :node="maskedData" 
            :lay="1" 
            :root_info="userData"
            @nextUser="next" 
        />
        <AppStructureLinear v-if="activeIndex == 0 && !notFound" 
            :vk_id="root_vk_id" 
            :key="root_vk_id"
            :searchUsers="searchUsers"
            :referersStack="[{name: userData.name, vk_id: userData.vk_id}]" 
            :lay="lay" 
            :isUser="isUser"
            :currUser="currUser"
            :showNums="showNums"
            :rootUser="userData"
            @notFound="linearNotFound"
            @cleanCurrSearchUser="cleanCurrSearchUser"
        />
        <span class="warning" v-if="notFound">Пользователя с таким ID нет в вашей структуре!</span>   
    </section>
</template>

<script>
import { getTree } from "@/services/user";
import AppGoodButton from "@/components/AppGoodButton.vue";
import AppBadButton from "@/components/AppBadButton.vue";
import AppMain from "@/components/AppMain.vue";
import AppStructureBinar from "@/components/AppStructureBinar.vue";
import AppStructureLinear from "@/components/AppStructureLinear.vue";
import { setLeg, getStructureInfo, findParents } from '@/services/user';
import AppModal from '@/components/AppModal.vue';

export default {
    components: { AppGoodButton, AppBadButton, AppMain, AppStructureBinar, AppStructureLinear, AppModal },
    props: { userData: Object },
    data() {
        return {
            listSwtich: ["Линейная структура", "Бинарная структура"],
            activeIndex: 0,
            showNums: true,
            text1: "РЕФЕРАЛЬНЫЕ ССЫЛКИ",
            text2: "ПОИСК",
            text3: "СБРОС",
            text4: "УСТАНОВИТЬ",
            isLinks: false,
            binarTree: null,
            nextUser: false,
            users: [],
            search: "",
            notFound: false,
            legs: [
                { label: "Лево", value: "left" }, { label: "Право", value: "right" }, { label: "Авто", value: "auto" },
            ],
            leg_index: 0,
            currLeg: "",
            isChangeLegModal: false,
            title: "",
            msg: "",
            struct_info: {},
            root_vk_id: 0,
            searchUsers: [],
            currUser: null,
            isUser: true,
            lay: 1,
        };
    },
    computed: {
        maskedStats() {
            return this.stats_data.map(item => ({
                ...item,
                num: this.showNums ? item.num : '*'.repeat(item.num.toString().length)
            }));
        },
        maskedStructInfo() {
            return {
                left: {
                    referals: this.showNums ? this.maskedData?.left?.referals : '*'.repeat(this.maskedData?.left?.referals.toString().length) || "",
                    volume: this.showNums ? this.maskedData?.left?.volume : '*'.repeat(this.maskedData?.left?.volume.toString().length) || ""
                },
                right: {
                    referals: this.showNums ? this.maskedData?.right?.referals : '*'.repeat(this.maskedData?.right.referals.toString().length) || "",
                    volume: this.showNums ? this.maskedData?.right?.volume : '*'.repeat(this.maskedData?.right.volume.toString().length) || ""
                },
                first_line_total: this.showNums ? this.struct_info.first_line_total : '*'.repeat(this.struct_info.first_line_total.toString().length) || "",
                total_referrals: this.showNums ? this.struct_info.total_referrals : '*'.repeat(this.struct_info.total_referrals.toString().length) || "",
            };
        },
        stats_data() {
            return [
                { "img": "marketing.png", "num": this.formatNumber(this.struct_info.clients_marketing), "text": "Клиентский маркетинг, (ур.)" },
                { "img": "binar.png", "num": this.formatNumber(this.struct_info.binar), "text": "Бинар, (%)" },
                { "img": "stonks.png", "num": this.formatNumber(this.struct_info.next_rank_sum), "text": "До следующего ранг. бонуса, (USDT)" },
                { "img": "rang.png", "num": this.formatNumber(this.struct_info.rank), "text": "Ранг" },
                { "img": "bonus.png", "num": this.formatNumber(this.struct_info.matching_bonus), "text": "Matching bonus, (ур.)" },
                { "img": "global_bonus.png", "num": this.formatNumber(this.struct_info.global_bonus), "text": "Глобальный бонус, (пул)" },
                { "img": "fast_start.png", "num": this.formatNumber(this.struct_info.fast_start_days), "text": "Быстрый старт, дней осталось" }
            ]
        },
        maskedData() {
            const maskNumbers = (node) => {
                if (!node || typeof node !== "object") return node;

                let maskedNode = { ...node };

                if ("first_line_referrals" in maskedNode) {
                    maskedNode.first_line_referrals = this.showNums 
                        ? maskedNode.first_line_referrals 
                        : '*'.repeat(maskedNode.first_line_referrals.toString().length);
                }
                if ("total_referrals" in maskedNode) {
                    maskedNode.total_referrals = this.showNums 
                        ? maskedNode.total_referrals 
                        : '*'.repeat(maskedNode.total_referrals.toString().length);
                }
                if ("left" in maskedNode) {
                    console.log(maskedNode.left.referals, maskedNode.total_referrals);
                    maskedNode.left.referals = this.showNums 
                        ? maskedNode.left.referals 
                        : '*'.repeat(maskedNode.left.referals.toString().length);
                    maskedNode.left.volume = this.showNums 
                        ? maskedNode.left.volume 
                        : '*'.repeat(maskedNode.left.volume.toString().length);
                }
                if ("right" in maskedNode) {
                    maskedNode.right.referals = this.showNums 
                        ? maskedNode.right.referals 
                        : '*'.repeat(maskedNode.right.referals.toString().length);
                    maskedNode.right.volume = this.showNums 
                        ? maskedNode.right.volume 
                        : '*'.repeat(maskedNode.right.volume.toString().length);
                }

                if ("left_leg" in maskedNode) {
                    maskedNode.left_leg = maskNumbers(maskedNode.left_leg);
                }
                if ("right_leg" in maskedNode) {
                    maskedNode.right_leg = maskNumbers(maskedNode.right_leg);
                }

                return maskedNode;
            };

            const originalTree = JSON.parse(JSON.stringify(this.binarTree));
            return maskNumbers(originalTree);
        }

    },
    async created() {
        this.root_vk_id = this.userData.vk_id;

        if (this.userData.current_leg == "left") this.leg_index = 0;
        if (this.userData.current_leg == "right") this.leg_index = 1;
        if (this.userData.current_leg == "auto") this.leg_index = 2;

        await this.next(this.userData.vk_id);

        this.struct_info = await getStructureInfo(this.userData.vk_id);
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
            const tree = await getTree(vk_id);
            this.binarTree = tree;
            this.getAllId(this.binarTree);
        },
        getAllId(node) {
            if (!node.vk_id) return
            else this.users.push(node.vk_id);

            if (node.left_leg) this.getAllId(node.left_leg);
            if (node.right_leg) this.getAllId(node.right_leg);
        },
        async searchId() {
            this.notFound = false;
            if (this.activeIndex == 1) {
                if (this.users.includes(+this.search)) {
                    this.binarTree = await getTree(+this.search);
                } else {
                    this.notFound = true;
                }
            } else {    
                const resp = await findParents(this.userData.vk_id, +this.search);
                this.searchUsers = resp.referrers;
                this.currUser = resp.searched_user;

                this.searchUsers.reverse();
                this.searchUsers.push({ "vk_id": this.currUser.vk_id, "name": this.currUser.name });
                if (this.searchUsers.length > 0) {
                    this.notFound = false;
                    this.root_vk_id = +this.search;
                }
                else this.notFound = true;
            }
            
        },
        async backup() {
            this.cleanCurrSearchUser();
            this.notFound = false;
            this.binarTree = await getTree(this.userData.vk_id);
            this.searchUsers = [];
            this.root_vk_id = this.userData.vk_id;
        },
        changeActiveLeg(index, name) {
            this.leg_index = index;
            this.currLeg = name;
        },
        async setLeg() {
            const response = await setLeg(this.userData.id, this.currLeg);
            if (response.status) {
                this.isChangeLegModal = true;
                this.title = "УСПЕШНО!";
                this.msg = "Выбранная нога была установлена.";
            }
        },
        linearNotFound() {
            this.notFound = true;
        },
        formatNumber(value) {
            if (typeof value === 'number') {
                return value.toLocaleString('ru-RU'); // Форматирование с пробелами
            }
            return value; // Если не число, возвращаем как есть
        },
        cleanCurrSearchUser(stackData, flag) {
            this.currUser = null;
            this.isUser = false;
            if (!flag && flag !== 0) {
                this.searchUsers = stackData;
            } 
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

    .switch_wrapper {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .switch {
        width: 490px;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        position: relative;
        @media (max-width: 900px) {
            width: 80%;
        }
    }

    .eye {
        width: 30px;
        height: 30px;
        cursor: pointer;
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
        justify-content: space-between;
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
        align-items: flex-end;
        row-gap: 15px;
    }

    .item_col h3 {
        font-size: 50px;
        font-family: 'OpenSans';
        font-weight: normal;
        color: white;
        text-align: end;
    }

    .item_col span {
        font-size: 12px;
        font-family: 'OpenSans';
        font-weight: normal;
        color: white;
        text-align: end;
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


    .legs {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
  }
  .left, .right {
    display: flex;
    align-items: center;
    column-gap: 20px;
  }
  .circle {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: #DA2D2D;
  }
  .binar_active {
    background: #1ABE38 !important;
  }
  .col {
    display: flex;
    flex-direction: column;
    row-gap: 5px;
  }
  .col h2, .col span {
    font-size: 20px;
    color: white;
    font-family: 'OpenSans';
  }
  .legs_item {
    display: flex;
    align-items: center;
    column-gap: 10px;
  }
  .check {
    width: 18px;
    height: 18px;
    outline: 1px solid white;
    outline-offset: 6px;
    border-radius: 50%;
    transition: .2s ease-in;
  }
  .activeBinar {
    background: white;
  }
  .legs_item span {
    font-size: 18px;
    color: white;
    font-family: 'OpenSans';
  }
  .btn {
    width: 150px;
  }
</style>