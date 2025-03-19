<template>
    <section class="linear">
        <div class="table">
            <div class="header" v-if="isRoot">
                <h2>Партнер</h2>
                <h2>ID / пакет</h2>
                <h2>Уровень</h2>
                <h2>Оборот</h2>
                <h2>Первая линия</h2>
                <h2>Команда</h2>
            </div>
            <div class="line" v-if="isRoot"></div>
            <div class="top_pagination" v-if="isRoot" :key="referersStackData">
                <span v-for="(item, index) in referersStackData" :key="index" @click="updateUser(item.vk_id, index)" class="pagination_item" :class="{ lastPaginationItem: index == referersStackData.length - 1 }">
                    {{ item.name }}
                    <span v-if="index != referersStackData.length - 1">></span>
                </span>
            </div>
            <div class="items">
                <div class="modal_wrapper" v-if="visibility && currUser" :key="currUser">
                    <div class="modal">
                    <img src="@/assets/images/close.png" class="close" @click="close">
                    <img :src="currUser.avatar_url" class="avatar">
                    <h2>{{ currUser.name }}</h2>
                    <div class="row_modal">
                        <span>Первая линия / всего: </span>
                        <span>{{ currUser?.first_line_referrals }}/{{ currUser?.total_referrals }}</span>
                    </div>
                    <div class="row_modal">
                        <span>ID:</span>
                        <span>{{ currUser.vk_id }}</span>
                    </div>
                    <div class="row_modal">
                        <span>Реферер ID:</span>
                        <span>{{ currUser.sponsor_vk_id }}</span>
                    </div>
                    </div>
                </div>
                
                <div class="item" @click="open(currUser)" v-if="currUser" :key="currUser" >
                    <div class="row first">
                        <div class="plus" @click.stop="toggleExpand(index, item)">{{ currUser?.first_line_referrals > 0 ? '-' : '' }}</div>
                        <div class="user_small">
                            <img :src="currUser.avatar_url">
                            <span>{{ currUser.name }}</span>
                        </div>
                    </div>
                    <div class="row">
                        <span>{{ currUser.vk_id }}</span>
                        <div class="circle" :style="{ background: !(['Free', 'Not active'].includes(currUser.package_name)) ? 'green' : 'red' }"></div>
                        <span>{{ currUser.package_name }}</span>
                    </div>
                    <span>{{ currUser?.level }}</span>
                    <span>{{ currUser?.all_volume }}</span>
                    <div class="row">
                        <img src="@/assets/images/team.png" class="team_icon">
                        <span>{{ currUser?.first_line_referrals }}</span>
                    </div>
                    <div class="row">
                        <img src="@/assets/images/team.png" class="team_icon">
                        <span>{{ currUser?.total_referrals }}</span>
                    </div>
                </div>
                <div v-for="(item, index) in paginatedHistory" :key="index" :style="{ marginLeft: currUser ? '40px' : '0px' }">
                    <div class="modal_wrapper" v-if="visibility">
                        <div class="modal">
                        <img src="@/assets/images/close.png" class="close" @click="close">
                        <img :src="selectedUser.avatar_url" class="avatar">
                        <h2>{{ selectedUser.name }}</h2>
                        <div class="row_modal">
                            <span>Первая линия / всего: </span>
                            <span>{{ selectedUser.first_line_referrals }}/{{ selectedUser.total_referrals }}</span>
                        </div>
                        <div class="row_modal">
                            <span>ID:</span>
                            <span>{{ selectedUser.vk_id }}</span>
                        </div>
                        <div class="row_modal">
                            <span>Реферер ID:</span>
                            <span>{{ selectedUser.sponsor_vk_id }}</span>
                        </div>
                        </div>
                    </div>
                    
                    <div class="item" @click="open(item)" >
                        <div class="row first">
                            <div class="plus" @click.stop="toggleExpand(index, item)"> {{ openedUsers[currentPage - 1][index] ? '-' : '+' }}</div>
                            <div class="user_small">
                                <img :src="item.avatar_url">
                                <span>{{ item.name }}</span>
                            </div>
                        </div>
                        <div class="row">
                            <span>{{ item.vk_id }}</span>
                            <div class="circle" :style="{ background: !(['Free', 'Not active'].includes(item.package_name)) ? 'green' : 'red' }"></div>
                            <span>{{ item.package_name }}</span>
                        </div>
                        <span>{{ item.level }}</span>
                        <span>{{ item.all_volume }}</span>
                        <div class="row">
                            <img src="@/assets/images/team.png" class="team_icon">
                            <span>{{ item.first_line_referrals }}</span>
                        </div>
                        <div class="row">
                            <img src="@/assets/images/team.png" class="team_icon">
                            <span>{{ item.total_referrals }}</span>
                        </div>
                    </div>

                    <!-- Вложенная таблица -->
                    <div v-if="openedUsers[currentPage - 1][index]" class="nested">
                        <AppStructureLinear 
                            :isRoot="false" 
                            :referer="item.vk_id" 
                            :vk_id="item.vk_id" 
                            :lay="lay + 1" 
                            :showNums="isHide" 
                            :referersStack="referersStackData" 
                            @updateUser="updateUser" 
                        />
                    </div>
                </div>
            </div>
        </div>
        <div class="switchs" v-if="totalPages > 1 && isRoot">
            <img src="@/assets/images/arrow.svg" @click="prevPage" style="transform: rotate(180deg);" v-if="currentPage > 1" />

            <span v-for="page in visiblePages" :key="page" @click="goToPage(page)" 
                  :class="{ active: page === currentPage }">
                {{ page }}
            </span>

            <span v-if="currentPage + 2 < totalPages">...</span>

            <img src="@/assets/images/arrow.svg" @click="nextPage" v-if="currentPage < totalPages" />
        </div>
    </section>
</template>

<script>
    import { getReferals } from "@/services/user";

    export default {
        props: {
            isRoot: { type: Boolean, default: true },
            referer: Number,
            vk_id: Number,
            lay: Number,
            referersStack: Array,
            showNums: { type: Boolean, default: true },
            searchUsers: Array,
            currUser: Object
        },
        data() {
            return {
                node: [],
                visibility: false,
                selectedUser: null,
                currentPage: 1,
                perPage: 5,
                openedUsers: [],
                referersStackData: [],
                isHide: false,
                isNewLay: false,
                totalOpened: 0
            };
        },
        async created() {
            const referals = await getReferals(this.vk_id);
            this.node = referals.referrals;

            this.updateOpenedUsers();

            console.log('ОТРИСОВАЛ!', this.searchUsers, this.referersStack);
            if (this.searchUsers.length == 0) this.referersStackData = this.referersStack
            else this.referersStackData = [...this.searchUsers];
            this.isHide = this.showNums;
            console.log(this.referersStackData);
        },
        computed: {
            totalPages() {
                return Math.ceil(this.maskedNode.length / this.perPage);
            },
            paginatedHistory() {
                const start = (this.currentPage - 1) * this.perPage;
                return this.maskedNode.slice(start, start + this.perPage);
            },
            visiblePages() {
                const pages = [];
                const lastPage = this.totalPages;

                if (this.currentPage >= lastPage - 2) {
                    for (let i = lastPage - 2; i <= lastPage; i++) {
                        if (i > 0) pages.push(i);
                    }
                } else {
                    pages.push(this.currentPage, this.currentPage + 1, this.currentPage + 2);
                }

                return pages;
            },
            maskedNode() {
                return this.node.map(item => ({
                    ...item,
                    all_volume: this.isHide ? item.all_volume : '*'.repeat(item.all_volume.toString().length),
                    level: this.isHide ? item.level : '*'.repeat(item.level.toString().length),
                    first_line_referrals: this.isHide ? item.first_line_referrals : '*'.repeat(item.first_line_referrals.toString().length),
                    total_referrals_buf: item.total_referrals,
                    total_referrals: this.isHide ? item.total_referrals : '*'.repeat(item.total_referrals.toString().length),
                }));
            }
        },
        watch: {
            referersStack: {
                handler(newStack) {
                    if (this.searchUsers.length == 0) this.referersStackData = [...newStack]
                    else this.referersStackData = [...this.searchUsers];
                },
                deep: true,
                immediate: true
            },
            showNums: {
                handler(newValue) {
                    this.isHide = newValue;
                },
                deep: true,
                immediate: true
            },
            searchUsers: {
                handler(newValue) {
                    console.log(newValue, "СРАБОТАЛ");
                    this.referersStackData = this.newValue && this.newValue.length > 0 ? [...this.newValue] : [];
                },
                deep: true,
                immediate: true
            },
            node: {
                handler(newValue) {
                    console.log("NODE: ", newValue);
                    this.updateOpenedUsers();
                },
                deep: true
            },
            currUser: {
                handler(newValue) {
                    console.log("currUser: ", newValue);
                },
                deep: true,
                immediate: true
            }
        },
        methods: {
            toggleExpand(index, item) {
                if (item.total_referrals_buf > 0) {
                    console.log(this.lay);

                    if (!this.openedUsers[this.currentPage - 1]) {
                        this.updateOpenedUsers();
                    }

                    if (this.openedUsers[this.currentPage - 1][index] === undefined) {
                        this.$set(this.openedUsers[this.currentPage - 1], index, false);
                    }
                    
                    if (this.lay % 2 == 0) {
                        console.log("ЖОПААААААААААААА_1", this.referersStackData);
                        this.$emit("updateUser", item.vk_id);
                        console.log("ЖОПААААААААААААА_2", this.referersStackData);
                        this.referersStackData.push({name: item.name, vk_id: item.vk_id});
                        console.log("ЖОПААААААААААААА_3", this.referersStackData);
                        this.isNewLay = true; 
                        this.totalOpened = 0;
                        console.log("ЖОПААААААААААААА_4", this.referersStackData);
                    } else {
                        if (!this.openedUsers[this.currentPage - 1][index] && this.lay < 2) {
                            this.resetOpenedUsers();
                            this.totalOpened++;
                                console.log("ЖОПА");
                            if (this.totalOpened > 1) this.referersStackData.pop(); // поставить другой флаг: флаг что несколько челов открыто
                            this.referersStackData.push({name: item.name, vk_id: item.vk_id});
                            this.openedUsers[this.currentPage - 1][index] = true;
                        } else {
                            console.log("ЖОПА_X2");
                            if (this.referersStackData.length > 1) this.referersStackData.pop();
                            this.openedUsers[this.currentPage - 1][index] = false;
                            this.totalOpened--;
                        }
                    }
                    
                }
            },
            open(item) {
                console.log(item.name);
                this.selectedUser = item;
                this.visibility = true;
            },
            close() {
                this.visibility = false;
                this.selectedUser = null;
            },
            goToPage(page) {
                if (page >= 1 && page <= this.totalPages) {
                    this.currentPage = page;
                }
            },
            nextPage() {
                if (this.currentPage < this.totalPages) {
                    this.resetOpenedUsers();
                    this.currentPage++;
                }
            },
            prevPage() {
                if (this.currentPage > 1) {
                    this.resetOpenedUsers();
                    this.currentPage--;
                }
            },
            async updateUser(vk_id, index = false) {
                if (!this.isNewLay) this.$emit("cleanCurrSearchUser");
                this.isNewLay = false;

                console.log(vk_id, index, this.referersStackData);
                this.referersStackData = index || index === 0 ? [...this.referersStackData].slice(0, index + 1) : [...this.referersStackData];
                console.log(this.referersStackData, this.currentPage);
                // this.resetOpenedUsers();
                const referals = await getReferals(vk_id);
                this.node = referals.referrals;
            },
            resetOpenedUsers() {
                this.openedUsers.forEach((row, i) => {
                    row.forEach((_, j) => {
                        this.openedUsers[i][j] = false;
                    });
                });
            },
            updateOpenedUsers() {
                this.openedUsers = Array.from({ length: this.totalPages || 1 }, () => Array(this.perPage).fill(false));
            }
        }
    };
</script>

<style scoped>
    .table {
        width: 100%;
        display: flex;
        flex-direction: column;
        row-gap: 15px;
    }
    .header {
        display: grid;
        grid-template-columns: 2fr 2fr 1fr 1fr 1fr 1fr;
        padding: 10px;
    }
    .header h2 {
        color: white;
        font-family: 'OpenSans';
        font-size: 16px;
        align-self: center;
        justify-self: center;
        text-align: center;
    }
    .line {
        width: 100%;
        height: 1px;
        background: white;
        opacity: .5;
    }
    .items {
        display: flex;
        flex-direction: column;
        width: 100%;
        position: relative;
    }
    .item {
        width: 100%;
        display: grid;
        grid-template-columns: 2fr 2fr 1fr 1fr 1fr 1fr;
        align-items: center;
        padding: 10px;
        border-left: 1px solid white;
    }
    .item:nth-of-type(2n+1) {
        background: #111433;
    }
    .item span {
        color: white;
        font-family: 'OpenSans';
        font-size: 12px;
        align-self: center;
        justify-self: center;
    }
    .row {
        display: flex;
        align-items: center;
        column-gap: 18px;
        align-self: center;
        justify-self: center;
    }
    .first {
        justify-self: start !important;
    }
    .plus {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: white;
        display: flex;
        align-items: center;
        justify-content: center;
        color: black;
        font-size: 10px;
        cursor: pointer;
        position: relative;
    }
    .plus::before {
        content: "";
        position: absolute;
        top: 6px;
        left: -10px;
        width: 10px;
        height: 1px;
        background: white;
    }
    .user_small {
        display: flex;
        align-items: center;
        column-gap: 5px;
    }
    .user_small img {
        width: 17px;
        height: 17px;
        border-radius: 50%;
        object-fit: cover;
        object-position: center;
    }
    .circle {
        width: 10px;
        height: 10px;
        border-radius: 50%;
    }
    .team_icon {
        width: 12px;
        height: 12px;
    }
    .nested {
        margin-left: 40px;
        padding-left: 10px;
    }

    .modal_wrapper {
        position: absolute;
        right: 50%;
        top: 0;
        width: 256px;
        background: #2F3251;
        border-radius: 10px;
        z-index: 989;
    }
    .modal {
        padding: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        row-gap: 10px;
        position: relative;
    }
    .modal h2 {
        font-size: 16px;
        color: white;
        font-family: 'OpenSans';
    }
    .avatar {
        width: 71px;
        height: 71px;
        border-radius: 50%;
        border: 1px solid white;
    }
    .close {
        width: 15px;
        height: 15px;
        position: absolute;
        right: 15px;
        top: 15px;
        cursor: pointer;
    }
    .row_modal {
        display: flex;
        justify-content: space-between;
        width: 100%;
    }
    .row_modal span {
        color: white;
        font-size: 14px;
        font-family: 'OpenSans';
    }
    .switchs {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 20px;
        gap: 10px;
    }
    .switchs img {
        cursor: pointer;
        width: 15px;
        filter: invert(100%);
    }
    .switchs span {
        cursor: pointer;
        font-size: 16px;
        padding: 5px 10px;
        border-radius: 5px;
        color: white;
        font-family: 'OpenSans';
    }
    .switchs span.active {
        background-color: #111433;
        color: white;
    }
    .top_pagination {
        display: flex;
        column-gap: 15px;
        flex-wrap: wrap;
        background: rgba(255, 255, 255, 0.112);
        padding: 4px 10px;
        border-radius: 5px;
    }
    .top_pagination span {
        font-size: 16px;
        color: white;
        font-family: 'OpenSans';
    }
    .pagination_item {
        display: flex;
        align-items: center;
        column-gap: 15px;
        transition: .2s ease-in;
    }
    .lastPaginationItem {
        background: linear-gradient(to right, #A139DE, #E14ABB, #E14A7A);
        -webkit-background-clip: text !important;
        background-clip: text !important;
        color: transparent !important;
    }
</style>