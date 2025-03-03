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
            <div class="items">
                <div v-for="(item, index) in paginatedHistory" :key="index">
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
                            <div class="plus" @click.stop="toggleExpand(index, item)"> {{ expandedNodes[index] ? '-' : '+' }}</div>
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
                        <span>{{ item.among }}</span>
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
                    <div v-if="expandedNodes[index]" class="nested">
                        <AppStructureLinear :isRoot="false" :referer="item.vk_id" :vk_id="item.vk_id" :lay="lay + 1" @updateUser="updateUser" />
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
    import { reactive } from "vue";
    import { getReferals } from "@/services/user";

    export default {
        props: {
            isRoot: { type: Boolean, default: true },
            referer: Number,
            vk_id: Number,
            lay: Number
        },
        data() {
            return {
                node: [],
                expandedNodes: reactive({}),
                visibility: false,
                selectedUser: null,
                currentPage: 1,
                perPage: 5,
            };
        },
        async created() {
            // const response = this.getNode();
            // this.node = response;
            this.openedUsers = Array.from({ length: this.totalPages }, () => Array(this.perPage).fill(false));

            console.log(this.vk_id);
            const referals = await getReferals(this.vk_id);
            this.node = referals.referrals;
            // ещё дополнительно обратиться к полю referrals, чтобы получить список
            // сначала вставить ручку сюда, если всё ок, то залить на гит, как бэк, и потом взять два файла стрёмных и попробовать доделать их добавив туда ручку
            console.log(this.node);
        },
        computed: {
            totalPages() {
                return Math.ceil(this.node.length / this.perPage);
            },
            paginatedHistory() {
                const start = (this.currentPage - 1) * this.perPage;
                return this.node.slice(start, start + this.perPage);
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
        },
        methods: {
            toggleExpand(index, item) {
                if (item.total_referrals > 0) {
                    if (this.lay == 2) {
                        console.log("lay == 2");
                        this.$emit("updateUser", item.vk_id);
                    }
                    if (!this.expandedNodes[index] && this.lay < 2) {
                        this.expandedNodes[index] = true;
                    } else {
                        this.expandedNodes[index] = false;
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
                    this.currentPage++;
                }
            },
            prevPage() {
                if (this.currentPage > 1) {
                    this.currentPage--;
                }
            },
            async updateUser(vk_id) {
                console.log("updateUser: ", vk_id);
                this.expandedNodes = reactive({});
                const referals = await getReferals(vk_id);
                this.node = referals.referrals;
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
    }
    .switchs span.active {
        background-color: #111433;
        color: white;
    }
</style>