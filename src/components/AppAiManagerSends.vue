<template>
    <AppAiManagerNewSend 
        v-if="isNewSend && !isOpenSend" 
        :manager_id="managers[activeIndex].id"
        :user_id="userData.id"
        :userTags="tags"
        :managers="managers"
        @isMaded="openSend(0)" 
        @backup="newSendClose"
    />
    <AppAiSendInfo 
        v-if="isOpenSend" 
        :campaignData="sendData" 
        :managerData="managers[activeIndex]"
        :userTags="tags"
        :managers="managers"
        @backup="isOpenSend = false, isNewSend = false"
    />
    <section class="autosends" v-if="!isNewSend && !isOpenSend">
        <!-- <div class="managers_switch">
            <span class="managers_switch_title">ИИ менеджер: </span>
            <div 
                class="switch" 
            >
                <span
                    v-for="(_, index) in managers"
                    :key="index"
                    class="switch_item"
                    :class="{ active: activeIndex === index }" 
                    @click="setActive(index)"
                >{{ index + 1 }}</span>
            </div> 
        </div> -->
        <div class="autosend">
            <div class="autosend_header">
                <span class="autosend_header_title">Авторассылки</span>
                <AppGoodButton :text="'+ СОЗДАТЬ'" @click="openNewSend" class="create_btn" />
            </div>
            <div class="autosend_body" v-if="campaigns.length > 0">
                <div class="autosend_body_row nothover">
                    <h3>Имя</h3>
                    <h3>Статус</h3>
                    <h3>Аудитория</h3>
                    <h3>Дата создания</h3>
                    <h3></h3>
                </div>
                <div 
                    v-for="(item, index) in paginatedData"
                    :key="index"
                    class="autosend_body_row"
                    :style="index == paginatedData.length - 1 ? 'border-bottom: none' : 'border-bottom: 1px solid rgba(255, 255, 255, 0.2)'"
                    @click="openSend(index)"
                >
                    <span>{{ item.name }}</span>
                    <div class="status"><img :src="item.is_active ? require('@/assets/images/play.png') : require('@/assets/images/pause.png')" /><span :class="item.is_active ? 'worked' : 'stoped'">{{ item.is_active ? "работает" : "остановлено" }}</span></div>
                    <span>{{ item.audience }}</span>
                    <span>{{ formatedDate(item.created_at * 1000) }}</span>
                    <div class="autosend_body_row_icons">
                        <img src="@/assets/images/manager_copy.png" class="manager_copy_icon" />
                        <img src="@/assets/images/manager_edit.png" class="manager_edit_icon" />
                        <img src="@/assets/images/trash.png" class="trash_icon" @click.stop="deleteSend(index)" />
                    </div>
                </div>
            </div>
            <div class="switchs" v-if="totalPages > 1 && campaigns.length > 0">
                <img src="@/assets/images/arrow.svg" @click="prevPage" style="transform: rotate(180deg);" v-if="currentPage > 1" />

                <span v-for="page in visiblePages" :key="page" @click="goToPage(page)" 
                    :class="{ active: page === currentPage }">
                    {{ page }}
                </span>

                <span v-if="currentPage + 2 < totalPages">...</span>

                <img src="@/assets/images/arrow.svg" @click="nextPage" v-if="currentPage < totalPages" />
            </div>
        </div>
    </section>
</template>

<script>
    import AppGoodButton from '@/components/AppGoodButton.vue';
    import AppAiManagerNewSend from '@/components/AppAiManagerNewSend.vue';
    import AppAiSendInfo from '@/components/AppAiSendInfo.vue';
    import { 
        getManagers,
        getCompaigns,
        deleteCampaign
    } from '@/services/manager';

    export default {
        components: { AppGoodButton, AppAiManagerNewSend, AppAiSendInfo },
        props: {
            userData: Object,
            activeIndex: Number
        },
        data() {
            return {
                listSwtich: [
                    {
                        index: 0,
                    },
                    {
                        index: 1,
                    },
                    {
                        index: 2,
                    }, 
                    {
                        index: 3,
                    }, 
                    {
                        index: 4,
                    }, 
                ],
                autosends_data: [
                    {
                        "name": "Рассылка 1",
                        "status": false,
                        "audience": 29,
                        "date": 1753787205862,
                        "subs": 29,
                        "unsubs": 0,
                        "conv": 100,
                        "filters": [
                                {
                                    name: "Содержит теги",
                                    tags: ["tag1", "tag2"]
                                },
                                {
                                    name: "Не содержит теги",
                                    tags: ["tag1", "tag2"]
                                }
                        ],
                        "filter_connection": ["И"],
                        "addInContact": true,
                        "copyTo": [0, 1, 1, 0, 1]
                    },
                    {
                        "name": "Рассылка 2",
                        "status": false,
                        "audience": 130,
                        "date": 1753787205862,
                        "subs": 29,
                        "unsubs": 0,
                        "conv": 100,
                        "filters": [
                                {
                                    name: "Содержит теги",
                                    tags: ["tag1", "tag2"]
                                },
                                {
                                    name: "Не содержит теги",
                                    tags: ["tag1", "tag2"]
                                }
                        ],
                        "filter_connection": ["И"],
                        "addInContact": true,
                        "copyTo": [0, 1, 1, 0, 1]
                    },
                    {
                        "name": "Рассылка 3",
                        "status": true,
                        "audience": 15,
                        "date": 1753787205862,
                        "subs": 29,
                        "unsubs": 0,
                        "conv": 100,
                        "filters": [
                                {
                                    name: "Содержит теги",
                                    tags: ["tag1", "tag2"]
                                },
                                {
                                    name: "Не содержит теги",
                                    tags: ["tag1", "tag2"]
                                }
                        ],
                        "filter_connection": ["И"],
                        "addInContact": true,
                        "copyTo": [0, 1, 1, 0, 1]
                    },
                    {
                        "name": "Рассылка 4",
                        "status": false,
                        "audience": 239,
                        "date": 1753787205862,
                        "subs": 29,
                        "unsubs": 0,
                        "conv": 100,
                        "filters": [
                                {
                                    name: "Содержит теги",
                                    tags: ["tag1", "tag2"]
                                },
                                {
                                    name: "Не содержит теги",
                                    tags: ["tag1", "tag2"]
                                }
                        ],
                        "filter_connection": ["И"],
                        "addInContact": true,
                        "copyTo": [0, 1, 1, 0, 1]
                    },
                    {
                        "name": "Рассылка 5",
                        "status": false,
                        "audience": 239,
                        "date": 1753787205862,
                        "subs": 29,
                        "unsubs": 0,
                        "conv": 100,
                        "filters": [
                                {
                                    name: "Содержит теги",
                                    tags: ["tag1", "tag2"]
                                },
                                {
                                    name: "Не содержит теги",
                                    tags: ["tag1", "tag2"]
                                }
                        ],
                        "filter_connection": ["И"],
                        "addInContact": true,
                        "copyTo": [0, 1, 1, 0, 1]
                    },
                    {
                        "name": "Рассылка 6",
                        "status": true,
                        "audience": 239,
                        "date": 1753787205862,
                        "subs": 29,
                        "unsubs": 0,
                        "conv": 100,
                        "filters": [
                                {
                                    name: "Содержит теги",
                                    tags: ["tag1", "tag2"]
                                },
                                {
                                    name: "Не содержит теги",
                                    tags: ["tag1", "tag2"]
                                }
                        ],
                        "filter_connection": ["И"],
                        "addInContact": true,
                        "copyTo": [0, 1, 1, 0, 1]
                    },
                    {
                        "name": "Рассылка 7",
                        "status": true,
                        "audience": 239,
                        "date": 1753787205862,
                        "subs": 29,
                        "unsubs": 0,
                        "conv": 100,
                        "filters": [
                                {
                                    name: "Содержит теги",
                                    tags: ["tag1", "tag2"]
                                },
                                {
                                    name: "Не содержит теги",
                                    tags: ["tag1", "tag2"]
                                }
                        ],
                        "filter_connection": ["И"],
                        "addInContact": true,
                        "copyTo": [0, 1, 1, 0, 1]
                    },
                    {
                        "name": "Рассылка 8",
                        "status": false,
                        "audience": 239,
                        "date": 1753787205862,
                        "subs": 29,
                        "unsubs": 0,
                        "conv": 100,
                        "filters": [
                                {
                                    name: "Содержит теги",
                                    tags: ["tag1", "tag2"]
                                },
                                {
                                    name: "Не содержит теги",
                                    tags: ["tag1", "tag2"]
                                }
                        ],
                        "filter_connection": ["И"],
                        "addInContact": true,
                        "copyTo": [0, 1, 1, 0, 1]
                    },
                    {
                        "name": "Рассылка 9",
                        "status": false,
                        "audience": 29,
                        "date": 1753787205862,
                        "subs": 29,
                        "unsubs": 0,
                        "conv": 100,
                        "filters": [
                                {
                                    name: "Содержит теги",
                                    tags: ["tag1", "tag2"]
                                },
                                {
                                    name: "Не содержит теги",
                                    tags: ["tag1", "tag2"]
                                }
                        ],
                        "filter_connection": ["И"],
                        "addInContact": true,
                        "copyTo": [0, 1, 1, 0, 1]
                    },
                    {
                        "name": "Рассылка 10",
                        "status": false,
                        "audience": 130,
                        "date": 1753787205862,
                        "subs": 29,
                        "unsubs": 0,
                        "conv": 100,
                        "filters": [
                                {
                                    name: "Содержит теги",
                                    tags: ["tag1", "tag2"]
                                },
                                {
                                    name: "Не содержит теги",
                                    tags: ["tag1", "tag2"]
                                }
                        ],
                        "filter_connection": ["И"],
                        "addInContact": true,
                        "copyTo": [0, 1, 1, 0, 1]
                    },
                    {
                        "name": "Рассылка 11",
                        "status": true,
                        "audience": 15,
                        "date": 1753787205862,
                        "subs": 29,
                        "unsubs": 0,
                        "conv": 100,
                        "filters": [
                                {
                                    name: "Содержит теги",
                                    tags: ["tag1", "tag2"]
                                },
                                {
                                    name: "Не содержит теги",
                                    tags: ["tag1", "tag2"]
                                }
                        ],
                        "filter_connection": ["И"],
                        "addInContact": true,
                        "copyTo": [0, 1, 1, 0, 1]
                    },
                    {
                        "name": "Рассылка 12",
                        "status": false,
                        "audience": 239,
                        "date": 1753787205862,
                        "subs": 29,
                        "unsubs": 0,
                        "conv": 100,
                        "filters": [
                                {
                                    name: "Содержит теги",
                                    tags: ["tag1", "tag2"]
                                },
                                {
                                    name: "Не содержит теги",
                                    tags: ["tag1", "tag2"]
                                }
                        ],
                        "filter_connection": ["И"],
                        "addInContact": true,
                        "copyTo": [0, 1, 1, 0, 1]
                    },
                    {
                        "name": "Рассылка 13",
                        "status": false,
                        "audience": 239,
                        "date": 1753787205862,
                        "subs": 29,
                        "unsubs": 0,
                        "conv": 100,
                        "filters": [
                                {
                                    name: "Содержит теги",
                                    tags: ["tag1", "tag2"]
                                },
                                {
                                    name: "Не содержит теги",
                                    tags: ["tag1", "tag2"]
                                }
                        ],
                        "filter_connection": ["И"],
                        "addInContact": true,
                        "copyTo": [0, 1, 1, 0, 1]
                    },
                    {
                        "name": "Рассылка 14",
                        "status": true,
                        "audience": 239,
                        "date": 1753787205862,
                        "subs": 29,
                        "unsubs": 0,
                        "conv": 100,
                        "filters": [
                                {
                                    name: "Содержит теги",
                                    tags: ["tag1", "tag2"]
                                },
                                {
                                    name: "Не содержит теги",
                                    tags: ["tag1", "tag2"]
                                }
                        ],
                        "filter_connection": ["И"],
                        "addInContact": true,
                        "copyTo": [0, 1, 1, 0, 1]
                    },
                    {
                        "name": "Рассылка 15",
                        "status": true,
                        "audience": 239,
                        "date": 1753787205862,
                        "subs": 29,
                        "unsubs": 0,
                        "conv": 100,
                        "filters": [
                                {
                                    name: "Содержит теги",
                                    tags: ["tag1", "tag2"]
                                },
                                {
                                    name: "Не содержит теги",
                                    tags: ["tag1", "tag2"]
                                }
                        ],
                        "filter_connection": ["И"],
                        "addInContact": true,
                        "copyTo": [0, 1, 1, 0, 1]
                    },
                    {
                        "name": "Рассылка 16",
                        "status": false,
                        "audience": 239,
                        "date": 1753787205862,
                        "subs": 29,
                        "unsubs": 0,
                        "conv": 100,
                        "filters": [
                                {
                                    name: "Содержит теги",
                                    tags: ["tag1", "tag2"]
                                },
                                {
                                    name: "Не содержит теги",
                                    tags: ["tag1", "tag2"]
                                }
                        ],
                        "filter_connection": ["И"],
                        "addInContact": true,
                        "copyTo": [0, 1, 1, 0, 1]
                    },
                ],
                pageSize: 9,
                currentPage: 1,
                isNewSend: false,
                isOpenSend: false,
                sendData: null,
                managers: [],
                campaigns: []
            }
        },
        computed: {
            tags() {
                if (!this.managers[this.activeIndex]?.assistant?.assistant_config?.user_filters) return [];
                return JSON.parse(this.managers[this.activeIndex].assistant.assistant_config.user_filters)
            },
            totalPages() {
                return Math.ceil(this.campaigns.length / this.pageSize);
            },
            visiblePages() {
                const pages = [];
                for (
                    let i = Math.max(1, this.currentPage - 2);
                    i <= Math.min(this.totalPages, this.currentPage + 2);
                    i++
                ) {
                    pages.push(i);
                }
                return pages;
            },
            paginatedData() {
                const start = (this.currentPage - 1) * this.pageSize;
                const end = start + this.pageSize;
                return this.campaigns.slice(start, end);
            },
        },
        async created() {
            const managers = await getManagers(this.userData.id);
            this.managers = managers;
            const campaigns = await getCompaigns(this.managers[this.activeIndex].id, this.pageSize, this.currentPage - 1);
            this.campaigns = campaigns.items;
        },
        methods: {
            async deleteSend(index) {
                await deleteCampaign(this.campaigns[index].campaign_id);
                const campaigns = await getCompaigns(this.managers[this.activeIndex].id, this.pageSize, this.currentPage - 1);
                this.campaigns = campaigns.items;
            },

            newSendClose() {
                this.isNewSend = false;
            },
            async openSend(index) {
                const campaigns = await getCompaigns(this.managers[this.activeIndex].id, this.pageSize, this.currentPage - 1);
                this.campaigns = campaigns.items;
                this.sendData = this.campaigns[index];
                this.isOpenSend = true;
            },
            openNewSend() {
                this.isNewSend = true;
            },
            prevPage() {
                if (this.currentPage > 1) {
                    this.currentPage--;
                }
            },
            nextPage() {
                if (this.currentPage < this.totalPages) {
                    this.currentPage++;
                }
            },
            goToPage(page) {
                if (page >= 1 && page <= this.totalPages) {
                    this.currentPage = page;
                }
            },
            formatedDate(time) {
                const date = new Date(time);

                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');

                return `${day}.${month}.${year} ${hours}:${minutes}`;
            },
            // setActive(index) {
            //     this.activeIndex = index;
            // },
        }
    };
</script>

<style scoped>
    .managers_switch {
        display: flex;
        column-gap: 21px;
        align-items: center;
    }
    .managers_switch_title {
        color: white;
        font-size: 20px;
        font-family: 'OpenSans';
    }
    .switch {
        width: 149px;
        display: grid;
        grid-template-columns: repeat(5, 1fr);
    }
    .switch_item {
        width: 30px;
        height: 30px;
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
    .active {
        background: #7023EC;
        font-weight: bold;
    }
    .autosend {
        display: flex;
        flex-direction: column;
        background: #1B1E3D;
        border-radius: 10px;
        width: 100%;
    }
    .autosend_header {
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: center;
        padding: 28px 30px 30px 30px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    }
    .autosend_header_title {
        font-size: 20px;
        color: white;
        font-family: 'OpenSans';
        font-weight: bold;
    }
    .create_btn {
        width: 150px;
        height: 51px;
        font-weight: bold;
    }
    .autosend_body {
        display: flex;
        flex-direction: column;
        width: 100%;
        padding: 0px 20px;
        margin-top: 20px;
    }
    .autosend_body_row {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        width: 100%;
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        padding: 20px 10px;
        transition: .2s;
        cursor: pointer;
    }
    .autosend_body_row:hover {
        background: #252847;
    }
    .nothover:hover {
        background: none !important;
    }
    .autosend_body_row h3, .autosend_body_row span {
        font-size: 16px;
        color: white;
        font-family: 'OpenSans';
    }
    .worked {
        color: #34C946 !important;
    }
    .stoped {
        color: #E34447 !important;
    }
    .status {
        display: flex;
        align-items: center;
        column-gap: 10px;
    }
    .status img {
        width: 20px;
        height: 20px;
    }
    .status span {
        margin-top: -3px;
    }
    .autosend_body_row_icons {
        display: flex;
        align-items: center;
        column-gap: 12px;
        justify-self: end;
    }
    .manager_copy_icon {
        width: 18px;
        height: 18px;
    }
    .manager_edit_icon, .trash_icon {
        width: 15px;
        height: 15px;
    }
    .switchs {
        display: flex;
        align-items: center;
        margin-top: 20px;
        padding: 0px 30px;
        margin-top: 50px;
        margin-bottom: 40px;
        gap: 10px;
    }
    .switchs img {
        cursor: pointer;
        width: 15px;
        filter: invert(100%);
        width: 15px;
        height: 15px;
    }
    .switchs span {
        cursor: pointer;
        font-size: 16px;
        padding: 5px 10px;
        color: white;
        font-size: 20px;
        font-family: 'OpenSans';
    }
    .switchs span.active {
        background-color: #7023EC;
        color: white;
        font-weight: normal !important;
    }
</style>