<template>
    <AppAiManagerConfirmModal 
        :message="msg" 
        :isOptions="true"
        :visibility1="isConfirmModal"
        @update:visibility1="isConfirmModal = $event"
        @yes="deleteSelected"
        @no="isConfirmModal = false"
    />
    <AppAiMangerPerson
        v-if="openPerson"
        :user="activeMan"
        :userTags="userTags"
        @openMsg="openMsg"
        @backup="openPerson = false"
        @deleteUser="setUserToDelete"
    />
    <section class="contacts" v-if="!openPerson">
        <div class="search">
            <input class="search_field" v-model="search" placeholder="Поиск" />
            <AppGoodButton :text="'ПОИСК'" class="search_btn" @click="searchUser" />
            <div class="filtered_users" v-if="search != ''">
                <div 
                    v-for="(man, index) in searchUser"
                    :key="index"
                    class="filtered_user"
                    @click="setActiveMan(man)"
                >
                    <img :src="man.avatar" />
                    <div class="col">
                        <span>{{ man.full_name }}</span>
                        <span class="mute_2">@{{ man.username }}</span>
                    </div>
                    
                </div>
                <div class="filtered_user" v-if="searchUser.length == 0">
                    <span>Не найдено!</span>
                </div>
            </div>
        </div>
        <div class="table">
            <div class="table_header" v-if="windowWidth > 650">
                <input 
                    v-model="allUsers" 
                    type="checkbox" 
                    class="input_square" 
                    @change="handleMainCheckbox"
                />
                <span
                    v-for="(item, index) in header_items"
                    :key="index"
                    class="header_text"
                >
                    {{ item }}
                </span>
            </div>
            <div class="table_header" v-if="windowWidth <= 650">
                <input 
                    v-model="allUsers" 
                    type="checkbox" 
                    class="input_square" 
                    @change="handleMainCheckbox"
                />
            </div>
            <div 
                class="table_row"
                v-for="(user, index) in paginatedData"
                :key="index"
                @click="setActiveMan(user)"
            >
                <input 
                    v-model="selectedIndexes[index]" 
                    type="checkbox" 
                    class="input_square" 
                    @click.stop
                />
                <div class="sm_row">
                    <span v-if="windowWidth <= 650" class="bold">ID:</span>
                    <span>{{ user.telegram_id }}</span>
                </div>
                <div class="sm_row">
                    <span v-if="windowWidth <= 650" class="bold">Имя:</span>
                    <span>{{ user.full_name }}</span>
                </div>
                <div class="sm_row">
                    <span v-if="windowWidth <= 650" class="bold">Username:</span>
                    <span>{{ user.username }}</span>
                </div>
                <div class="sm_row">
                    <span v-if="windowWidth <= 650" class="bold">Теги:</span>
                    <div class="tags">
                        <div class="filter_item_tags_row">
                            <div 
                                v-for="(tag, index_tag) in user.tags"
                                :key="index_tag"
                                class="filter_item_tag"
                            >
                                {{ tag }}
                                <img src="@/assets/images/close.png" class="delete_tag" @click.stop="deleteTag(index, index_tag, tag)"/>
                            </div>
                        </div>
                        <div class="dropdown_tags" v-if="isNewTags == index">
                            <div 
                                v-for="(tag, tag_index) in userTags.filter(tag => !user.tags.includes(tag))"
                                :key="tag_index"
                                class="dropdown_tag"
                                @click.stop="addTag(index, tag)"
                            >
                                {{ tag }}
                            </div>
                        </div>
                        <AppBadButton 
                            v-if="!(userTags.length == 1 && userTags[0] == '')"
                            :text="'+ ДОБАВИТЬ'" 
                            class="add_tag_btn" 
                            @click.stop="openNewTags(index)"
                        />
                        <AppGoodButton 
                            v-if="tagBuffer.length > 0"
                            class="save_tags"
                            @click.stop="saveTags(index)"
                            :text="'СОХРАНИТЬ'"
                        />
                    </div>
                </div>
                <div class="sm_row">
                    <span v-if="windowWidth <= 650" class="bold">Первая активность:</span>
                    <span>{{ formatedFullDate(+user.first_message_ts * 1000) }}</span>
                </div>
            </div>
            <div class="switchs" v-if="totalPages > 1">
                <img src="@/assets/images/arrow.svg" @click="prevPage" style="transform: rotate(180deg);" v-if="currentPage > 1" />

                <span v-for="page in visiblePages" :key="page" @click="goToPage(page)" 
                    :class="{ active: page === currentPage }">
                    {{ page }}
                </span>

                <span v-if="currentPage + 2 < totalPages">...</span>

                <img src="@/assets/images/arrow.svg" @click="nextPage" v-if="currentPage < totalPages" />
            </div>
        </div>
        <div class="btn_row">
            <AppGoodButton :text="'ЗАГРУЗИТЬ'" class="download" />
            <AppBadButton :text="'УДАЛИТЬ'" class="delete" @click="openModal" />
        </div>
        
    </section>
</template>

<script>
    import { 
        getAllDialogs,
        deleteUser,
        changeUser
    } from '@/services/manager';
    import AppBadButton from '@/components/AppBadButton.vue';
    import AppGoodButton from '@/components/AppGoodButton.vue';
    import AppAiManagerConfirmModal from '@/components/AppAiManagerConfirmModal.vue';
    import AppAiMangerPerson from '@/components/AppAiMangerPerson.vue';
    export default {
        components: { AppBadButton, AppGoodButton, AppAiManagerConfirmModal, AppAiMangerPerson },
        props: {
            bot_id: String,
            userTags: Array
        },
        data() {
            return {
                header_items: ['ID', 'Имя', 'Username', 'Теги', 'Первая активность'],
                users: [],
                selectedIndexes: null,
                search: "",
                isNewTags: -1,
                tagBuffer: [],
                currentPage: 1,
                pageSize: 7,
                msg: "",
                isConfirmModal: false,
                activeMan: null,
                openPerson: false,
                windowWidth: null
            }
        },
        computed: {
            totalPages() {
                return this.users.length / this.pageSize;
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
                return this.users.slice(start, end);
            },
            searchUser() {
                const new_people = this.users.filter(man => man.username.trim().toLowerCase().includes(this.search.trim().toLowerCase()) || man.full_name.trim().toLowerCase().includes(this.search.trim().toLowerCase()));
                return new_people;
            },
        },
        async created() {
            const resp = await getAllDialogs(this.bot_id);
            this.users = resp;
            this.selectedIndexes = Array.from({ length: this.users.length }, () => 0);
            document.addEventListener('click', this.handleClickOutside);
            document.addEventListener('resize', this.handleResize);
            this.handleResize();
        },
        methods: {
            handleResize() {
                this.windowWidth = window.innerWidth;
            },
            handleMainCheckbox(event) {
                this.selectedIndexes = Array.from({ length: this.users.length }, () => event.target.checked);
            },
            async setUserToDelete(telegram_id) {
                const index = this.users.findIndex(user => user.telegram_id == telegram_id);
                this.selectedIndexes[index] = 1;
                await this.deleteSelected();
                this.openPerson = false;
            },
            openMsg(telegram_id) {
                this.$emit('openMsg', telegram_id);
            },
            setActiveMan(man) {
                this.activeMan = man;
                this.openPerson = true;
            },
            openModal() {
                this.msg = 'Вы подтверждаете удаление?';
                this.isConfirmModal = true;
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
            goToPage(page) {
                if (page >= 1 && page <= this.totalPages) {
                    this.currentPage = page;
                }
            },
            async saveTags(index) {
                const resp = await changeUser(this.users[index].telegram_id, {"tags": this.users[index].tags});
                if (resp) {
                    this.tagBuffer = [];
                    this.closeNewTags();
                }
            },
            handleClickOutside(event) {
                const clickedEl = event.target;
                if (!clickedEl.closest('.dropdown_tags') && !clickedEl.closest('.add_tag_btn') && this.isNewTags != -1) {
                    this.closeNewTags();
                }
            },
            async deleteSelected() {
                for (let [index, el] of this.selectedIndexes.entries()) {
                    if (el) {
                        await deleteUser(this.users[index].dialog_id);
                        this.users = await getAllDialogs(this.bot_id);
                    }
                }
                this.selectedIndexes = Array.from({ length: this.users.length }, () => false);
            },
            closeNewTags() {
                this.isNewTags = -1;
            } ,
            addTag(index, tag) {
                this.users[index].tags.push(tag);

                if (this.tagBuffer.indexOf(tag) == -1) this.tagBuffer.push(tag)
                else this.tagBuffer = this.tagBuffer.filter(t => t != tag);

                this.closeNewTags();
            },
            openNewTags(index) {
                this.isNewTags = index;
            }, 
            deleteTag(index, tag_index, tag) {
                this.users[index].tags.splice(tag_index, 1);

                if (this.tagBuffer.indexOf(tag) == -1) this.tagBuffer.push(tag)
                else this.tagBuffer = this.tagBuffer.filter(t => t != tag);
            },
            formatedFullDate(time) {
                const date = new Date(time);

                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');

                return `${day}.${month}.${year} ${hours}:${minutes}`;
            },
        }
    };
</script>

<style scoped>
    .bold {
        font-weight: bold;
    }
    .switchs {
        display: flex;
        align-items: center;
        margin-top: 20px;
        padding: 0px 30px;
        margin-top: 50px;
        margin-bottom: 40px;
        gap: 10px;
        @media (max-width: 650px) {
            padding: 0px;
            margin-top: 40px;
        }
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
        @media (max-width: 650px) {
            line-height: 1;
        }
    }
    .switchs span.active {
        background-color: #7023EC;
        color: white;
        font-weight: normal !important;
    }
    .save_tags {
        width: 130px;
        height: 32px;
        font-size: 9.98px;
    }
    .delete {
        width: 150px;
        height: 51px;
        @media (max-width: 650px) {
            width: 160px;
            height: 40px;
            font-size: 14px;
        }
    }
    .download {
        width: 166px;
        height: 51px;
        @media (max-width: 650px) {
            width: 160px;
            height: 40px;
            font-size: 14px;
        }
    }
    .btn_row {
        display: flex;
        column-gap: 20px;
        margin-top: 30px;
    }
    .tags {
        display: flex;
        flex-direction: column;
        row-gap: 10px;
        position: relative;
    }
    .sm_row {
        display: flex;
        column-gap: 10px;
    }
    .table_row span {
        font-size: 14px;
        color: white;
        font-family: 'OpenSans';
    }
    .table_row {
        width: 100%;
        display: grid;
        grid-template-columns: 1fr 2fr 2fr 2fr 3fr 3fr;
        column-gap: 35px;
        padding: 20px;
        transition: .2s ease-in;
        cursor: pointer;
        @media (max-width: 650px) {
            display: flex;
            flex-direction: column;
            row-gap: 13px;
            padding: 20px 15px;
        }
    }
    .table_row:nth-child(2n) {
        background: #393c5b3d;
    }
    .table_row:hover {
        transform: scale(1.05);
    }
    .header_text {
        font-size: 16px;
        font-family: 'OpenSans';
        color: rgba(255, 255, 255, 0.5);
        font-weight: 500;
    }
    input[type="checkbox"] {
        width: 24px;
        height: 24px;
        appearance: none; /* Убираем стандартный стиль */
        border: 2px solid #333;
        border-radius: 4px;
        background-color: white;
        cursor: pointer;
        padding: 0;
        @media (max-width: 650px) {
            margin-top: 0px;
        }
    }

    input[type="checkbox"]:checked {
        background-color: #4CAF50; /* Цвет при активации */
        border-color: #4CAF50;
        position: relative;
    }
    .table_header {
        width: 100%;
        display: grid;
        grid-template-columns: 1fr 2fr 2fr 2fr 3fr 3fr;
        column-gap: 35px;
        padding: 20px;
        border-top: 1px solid rgba(255, 255, 255, 0.5);
        border-bottom: 1px solid rgba(255, 255, 255, 0.5);
        @media (max-width: 650px) {
            display: flex;
            padding: 15px;
            border-top: 1px solid rgba(255, 255, 255, 0.5);
            border-bottom: none;
        }
    }
    .table {
        width: 100%;
        display: flex;
        flex-direction: column;
    }
    .dropdown_tags {
        position: absolute;
        left: 110px;
        top: 50px;
        z-index: 999;
        background: #434665;
        padding: 10px 8px;
        display: flex;
        flex-direction: column;
    }
    .dropdown_tag {
        font-size: 15px;
        color: white;
        font-family: 'OpenSans';
        display: flex;
        align-items: center;
        padding: 8px 0px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.3);
    }
    .add_tag_btn {
        width: 92px;
        height: 32px;
        font-size: 9.98px;
        letter-spacing: 0px;
    }
    .filter_item_tags_row {
        display: flex;
        column-gap: 14px;
        flex-wrap: wrap;
        row-gap: 10px;
    }
    .filter_item_tag {
        font-size: 9.98px;
        color: white;
        font-family: 'OpenSans';
        padding: 10px;
        border: .62px solid white;
        border-radius: 6.24px;
        display: flex;
        column-gap: 12px;
    }
    .delete_tag {
        width: 9px;
        object-fit: contain;
        cursor: pointer;
    }
    .search_btn {
        width: 150px;
        height: 40px;
        font-size: 16px;
        @media (max-width: 650px) {
            width: 100%;
            font-size: 14px;
            letter-spacing: 0px;
        }
    }
    .search_field {
        width: 100%;
        height: 40px;
        background: none;
        border: 1px solid white;
        border-radius: 10px;
        padding-left: 15px;
        font-size: 16px;
        color: rgba(255, 255, 255, 0.5);
        font-family: 'OpenSans';
    }
    .search {
        width: 100%;
        display: flex;
        column-gap: 20px;
        position: relative;
        margin-bottom: 48px;
        @media (max-width: 650px) {
            flex-direction: column;
            row-gap: 10px;
        }
    }
    .filtered_users {
        position: absolute;
        left: 0;
        top: 45px;
        width: 100%;
        display: flex;
        flex-direction: column;
        row-gap: 10px;
        background: #111433;
        max-height: 300px;
        overflow-y: auto;
        z-index: 910;
    }
    .filtered_user {
        display: flex;
        column-gap: 20px;
        padding: 10px;
        align-items: center;
        cursor: pointer;
    }
    .filtered_user img {
        width: 60px;
        height: 60px;
        border-radius: 50%;
    }
    .filtered_user span {
        font-size: 18px;
        color: white;
        font-family: 'OpenSans';
    }
    .col {
        display: flex;
        flex-direction: column;
    }
    .mute_2 {
        color: rgba(255, 255, 255, 0.5) !important;
        font-size: 14px !important;
    }
    .contacts {
        width: 100%;
        display: flex;
        flex-direction: column;
    }
</style>