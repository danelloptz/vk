<template>
    <section class="linear">
        <div class="table">
            <div class="header" v-if="isRoot && windowWidth > 650">
                <h2>Партнер</h2>
                <h2>ID / пакет</h2>
                <h2>Уровень</h2>
                <h2>Первая линия</h2>
                <h2>Команда</h2>
            </div>
            <div class="line" v-if="isRoot"></div>
            <div class="top_pagination" v-if="isRoot" :key="pagination.length">
                <span v-for="(item, index) in pagination" :key="index" @click="updateUser(item.vk_id, index)" class="pagination_item" :class="{ lastPaginationItem: index == pagination.length - 1 }">
                    {{ item.name }}
                    <span v-if="index != pagination.length - 1">></span>
                </span>
            </div>
            <div class="items">
                <div class="modal_wrapper" v-if="visibility && currUser" :key="currUser">
                    <div class="modal">
                    <img src="@/assets/images/close.png" class="close" @click="close">
                    <img :src="currUser.avatar_url" class="avatar">
                    <h2>{{ currUser.name }}</h2>
                    <span class="package_name">{{ currUser.package_name }}</span>
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
                    <div class="row_modal" v-if="isFirstLine" style="justify-content: center; column-gap: 23px;">
                        <a :href="vkData" v-if="vkData" target="_blank"><img src="@/assets/images/vk.png"></a>
                        <a :href="tgData?.link" v-if="tgData?.link" target="_blank"><img src="@/assets/images/telegram.png"></a>
                        <a :href="whtData?.link" v-if="whtData?.link" target="_blank"><img src="@/assets/images/whatsapp.png"></a>
                    </div>
                    <div class="row_col_modal">
                        <span>Дата регистрации: </span>
                        <span>{{ formatedDate(currUser?.date_created) }}</span>
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
                    <div class="row">
                        <img src="@/assets/images/team.png" class="team_icon">
                        <span>{{ currUser?.first_line_referrals }}</span>
                    </div>
                    <div class="row">
                        <img src="@/assets/images/team.png" class="team_icon">
                        <span>{{ currUser?.total_referrals }}</span>
                    </div>
                </div>

                <div class="item_mob" @click="open(currUser)" v-if="currUser && windowWidth <= 650" :key="currUser" >
                        <div class="plus" @click.stop="toggleExpand(index, item)">
                            {{ currUser?.first_line_referrals > 0 ? (openedUsers[currentPage - 1][index] ? '-' : '+') : '' }}
                        </div>
                        <div class="item_mob_content">
                            <div class="user_small">
                                <img :src="currUser.avatar_url">
                                <span>{{ currUser.name }}</span>
                            </div>
                            <div class="item_mob_content_row">
                                <span>ID / тариф: {{ currUser.vk_id }}</span>
                                <div class="item_mob_tarif">
                                    <div class="circle" :style="{ background: !(['Free', 'Not active'].includes(currUser.package_name)) ? 'green' : 'red' }"></div>
                                    <span>{{ currUser.package_name }}</span>
                                </div>
                            </div>
                            <div class="item_mob_content_row">
                                <span>Первая линия / Команда: </span>
                                <img src="@/assets/images/team.png" class="team_icon">
                                <span>{{ currUser.first_line_referrals }}</span>
                                <span>/</span>
                                <span>{{ currUser.total_referrals }}</span>
                            </div>
                            <span>Уровень: {{ currUser.level }}</span>
                        </div>
                    </div>

                <div v-for="(item, index) in paginatedHistory" :key="index" :style="{ marginLeft: currUser ? '40px' : '0px' }">
                    <div class="modal_wrapper" v-if="visibility">
                        <div class="modal">
                        <img src="@/assets/images/close.png" class="close" @click="close">
                        <img :src="selectedUser.avatar_url" class="avatar">
                        <h2>{{ selectedUser.name }}</h2>
                        <span class="package_name">{{ selectedUser.package_name }}</span>
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
                        <div class="row_modal" v-if="isFirstLine" style="justify-content: center; column-gap: 23px;">
                            <a :href="vkData" v-if="vkData" target="_blank"><img src="@/assets/images/vk.png"></a>
                            <a :href="tgData?.link" v-if="tgData?.link" target="_blank"><img src="@/assets/images/telegram.png"></a>
                            <a :href="whtData?.link" v-if="whtData?.link" target="_blank"><img src="@/assets/images/whatsapp.png"></a>
                        </div>
                        <div class="row_col_modal">
                            <span>Дата регистрации: </span>
                            <span>{{ formatedDate(item.date_created) }}</span>
                        </div>
                        </div>
                    </div>
                    
                    <div class="item" @click="open(item)" v-if="windowWidth > 650">
                        <div class="row first">
                            <div class="plus" @click.stop="toggleExpand(index, item)">
                                {{ item?.first_line_referrals > 0 ? (openedUsers[currentPage - 1][index] ? '-' : '+') : '' }}
                            </div>
                            <div class="user_small">
                                <img :src="item.avatar_url">
                                <span>{{ item.name }}</span>
                            </div>
                        </div>
                        <div class="row_special">
                            <span>{{ item.vk_id }}</span>
                            <div class="circle" :style="{ background: !(['Free', 'Not active'].includes(item.package_name)) ? 'green' : 'red' }"></div>
                            <span>{{ item.package_name }}</span>
                        </div>
                        <span>{{ item.level }}</span>
                        <div class="row">
                            <img src="@/assets/images/team.png" class="team_icon">
                            <span>{{ item.first_line_referrals }}</span>
                        </div>
                        <div class="row">
                            <img src="@/assets/images/team.png" class="team_icon">
                            <span>{{ item.total_referrals }}</span>
                        </div>
                    </div>

                    <div class="item_mob" @click="open(item)" v-if="windowWidth <= 650">
                        <div class="plus" @click.stop="toggleExpand(index, item)">
                            {{ item?.first_line_referrals > 0 ? (openedUsers[currentPage - 1][index] ? '-' : '+') : '' }}
                        </div>
                        <div class="item_mob_content">
                            <div class="user_small">
                                <img :src="item.avatar_url">
                                <span>{{ item.name }}</span>
                            </div>
                            <div class="item_mob_content_row">
                                <span>ID / тариф: {{ item.vk_id }}</span>
                                <div class="item_mob_tarif">
                                    <div class="circle" :style="{ background: !(['Free', 'Not active'].includes(item.package_name)) ? 'green' : 'red' }"></div>
                                    <span>{{ item.package_name }}</span>
                                </div>
                            </div>
                            <div class="item_mob_content_row">
                                <span>Первая линия / Команда: </span>
                                <img src="@/assets/images/team.png" class="team_icon">
                                <span>{{ item.first_line_referrals }}</span>
                                <span>/</span>
                                <span>{{ item.total_referrals }}</span>
                            </div>
                            <span>Уровень: {{ item.level }}</span>
                        </div>
                    </div>

                    <!-- Вложенная таблица -->
                    <div v-if="openedUsers[currentPage - 1][index]" class="nested">
                        <AppStructureLinear 
                            :rootUser="rootUser"
                            :isRoot="false" 
                            :referer="item.vk_id" 
                            :vk_id="item.vk_id" 
                            :lay="lay + 1" 
                            :showNums="isHide" 
                            :referersStack="referersStackData" 
                            :searchUsers="[]"
                            :windowWidth="windowWidth"
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
            isUser: { type: Boolean, default: true },
            referer: Number,
            vk_id: Number,
            lay: Number,
            referersStack: Array,
            showNums: { type: Boolean, default: true },
            searchUsers: Array,
            currUser: Object,
            rootUser: Object,
            windowWidth: Number
        },
        data() {
            return {
                node: [],
                visibility: false,
                selectedUser: null,
                currentPage: 1,
                perPage: 20,
                openedUsers: [],
                referersStackData: [],
                isHide: false,
                isNewLay: false,
                totalOpened: 0,
                isZopa: false,
                zopaIndex: false,
                isFirstLine: false,
                tgData: null,
                vkData: null,
                whtData: null
            };
        },
        async created() {
            if (this.vk_id == this.rootUser?.vk_id || (this.currUser && (this.currUser?.sponsor_vk_id === this.rootUser?.vk_id))) this.isFirstLine = true
            else this.isFirstLine = false;
            const referals = await getReferals(this.rootUser.vk_id, this.vk_id);
            this.node = referals.referrals;
            console.log(this.node);

            this.updateOpenedUsers();

            if (this.searchUsers.length == 0) this.referersStackData = this.referersStack
            else this.referersStackData = [...this.searchUsers];
            this.isHide = this.showNums;
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
                    total_referrals_buf: item.first_line_referrals,
                    total_referrals: this.isHide ? item.total_referrals : '*'.repeat(item.total_referrals.toString().length),
                }));
            },
            pagination() {
                return [...this.referersStackData];
            }
        },
        watch: {
            referersStack: {
                handler(newStack) {
                    if (!this.zopaIndex) {
                        if (this.isUser) {
                            this.referersStackData = [...newStack];
                        } 
                        else {
                            if (this.searchUsers.length != 0) this.referersStackData = [...this.searchUsers]
                            else this.referersStackData = [...newStack];
                        } 
                    }
                    // вот тут очко, всё везде добавляется но в конце здесь берётся старое значение из сёрчюзерс
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
                    this.referersStackData = this.newValue && this.newValue.length > 0 ? [...newValue] : [];
                },
                deep: true,
                immediate: true
            },
            node: {
                handler() {
                    this.updateOpenedUsers();
                },
                deep: true
            },
            currUser: {
                async handler(newValue) {
                    if (newValue?.vk_id == this.rootUser?.vk_id || (this.currUser && (this.currUser?.sponsor_vk_id === this.rootUser?.vk_id))) this.isFirstLine = true
                    else this.isFirstLine = false;
                    if (newValue?.vk_id) {
                        const referals = await getReferals(this.rootUser.vk_id, newValue.vk_id);
                        this.node = referals.referrals;
                    }
                },
                deep: true,
                immediate: true
            },
            referersStackData: {
                handler(newValue) {
                    this.referersStackData = newValue;
                },
                deep: true,
                immediate: true
            }
        },
        methods: {
            toggleExpand(index, item) {
                if (item.total_referrals_buf > 0) {

                    if (!this.openedUsers[this.currentPage - 1]) {
                        this.updateOpenedUsers();
                    }

                    if (this.openedUsers[this.currentPage - 1][index] === undefined) {
                        this.$set(this.openedUsers[this.currentPage - 1], index, false);
                    }
                    
                    if (this.lay % 2 == 0 || this.windowWidth <= 650) {
                        console.log(item.vk_id);
                        this.isZopa = true;
                        this.referersStackData.push({name: item.name, vk_id: item.vk_id});
                        
                        if (this.windowWidth <= 650) this.updateUser(item.vk_id)
                        else this.$emit("updateUser", item.vk_id);

                        this.isNewLay = true; 
                        this.totalOpened = 0;
                    } else {
                        if (!this.openedUsers[this.currentPage - 1][index] && this.lay < 2) {
                            this.resetOpenedUsers();
                            this.totalOpened++;
                            if (this.totalOpened > 1) {
                                this.referersStackData.pop();
                            } 
                            this.referersStackData.push({name: item.name, vk_id: item.vk_id});
                            this.openedUsers[this.currentPage - 1][index] = true;
                        } else {
                            if (this.referersStackData.length > 1) {
                                this.referersStackData.pop();
                            } 
                            this.openedUsers[this.currentPage - 1][index] = false;
                            this.totalOpened--;
                        }
                    }
                    
                }
            },
            open(item) {
                this.selectedUser = item;
                this.visibility = true;
                if (this.isFirstLine) {
                    console.log(item);
                    this.tgData = item?.social_links.filter(link => link.type === "Telegram").at(-1) || [];
                    this.whtData = item?.social_links.filter(link => link.type === "Whatsapp").at(-1) || [];
                    this.vkData = `https://vk.com/id${item.vk_id}`;
                }
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
                console.log("updateUser");
                this.totalOpened = 0;
                if (!this.isNewLay) this.$emit("cleanCurrSearchUser", this.referersStackData, index);
                this.isNewLay = false;
                this.zopaIndex = index;

                this.referersStackData = index || index === 0 ? [...this.referersStackData].slice(0, index + 1) : [...this.referersStackData];
                // this.resetOpenedUsers();
                
                if (vk_id == this.rootUser?.vk_id || (this.currUser && (this.currUser?.sponsor_vk_id === this.rootUser?.vk_id))) this.isFirstLine = true
                else this.isFirstLine = false;
                
                const referals = await getReferals(this.rootUser.vk_id, vk_id);
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
            },
            formatedDate(dateString) {
                const date = new Date(dateString);

                const day = String(date.getUTCDate()).padStart(2, '0');
                const month = String(date.getUTCMonth() + 1).padStart(2, '0');
                const year = date.getUTCFullYear(); // Год

                return `${day}.${month}.${year}`;
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
        grid-template-columns: 2fr 2fr 1fr 1fr 1fr;
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
        grid-template-columns: 2fr 2fr 1fr 1fr 1fr;
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
    .row_special {
        display: grid;
        grid-template-columns: 4fr 1fr 4fr;
        align-items: center;
        column-gap: 18px;
        align-self: center;
        /* justify-self: center; */
        justify-items: start;
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
        @media (max-width: 650px) {
            column-gap: 10px;
        }
    }
    .user_small img {
        width: 17px;
        height: 17px;
        border-radius: 50%;
        object-fit: cover;
        object-position: center;
        @media (max-width: 650px) {
            width: 20px;
            height: 20px;
        }
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
        @media (max-width: 650px) {
            right: 10%;
        }
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
    .row_modal a {
        cursor: pointer;
    }
    .row_modal img {
        width: 34px;
        height: 34px;
    }
    .row_col_modal {
        display: flex;
        flex-direction: column;
        align-items: center;
        row-gap: 5px;
    }
    .row_col_modal span {
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
    .package_name {
        color: white;
        font-size: 14px;
        font-weight: bold;
        font-family: 'OpenSans';
        padding: 1px 18px;
        background: #7023EC;
        border-radius: 5px;
        width: max-content;
        word-wrap: break-word;
    }
    .item_mob {
        width: 100%;
        display: flex;
        column-gap: 10px;
        align-items: start;
        padding: 20px 5px;
    }
    .item_mob:nth-child(2n+1) {
        background: #111433;
    }
    .item_mob_content {
        display: flex;
        flex-direction: column;
        row-gap: 10px;
    }
    .item_mob_content_row {
        display: flex;
        align-items: center;
        column-gap: 6px;
    }
    .item_mob span {
        font-size: 14px !important;
        color: white;
        font-family: 'OpenSans';
    }
    .item_mob_tarif {
        display: flex;
        align-items: center;
        column-gap: 5px;
        margin-left: 9px;
    }
</style>