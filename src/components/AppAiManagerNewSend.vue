<template>
    <AppModal 
        :title="title" 
        :message="msg" 
        :visibility1="isModal"
        @update:visibility1="isModal = $event"
    />
    <AppAiManagerConfirmModal 
        :message="msg" 
        :visibility1="isConfirmModal"
        @update:visibility1="isConfirmModal = $event"
        @yes="isConfirmModal = false"
        @no="cancelCopy"
    />
    <section class="new_send">
        <h2>Создать рассылку</h2>
        <!-- <div class="managers_switch">
            <span class="managers_switch_title">ИИ менеджер: </span>
            <div 
                class="switch" 
            >
                <span
                    v-for="(item, index) in listSwtich"
                    :key="index"
                    class="switch_item"
                    :class="{ active: activeIndex === item.index }" 
                    @click="setActive(item.index)"
                >{{ item.index + 1 }}</span>
            </div> 
        </div> -->
        <div class="new_send_row m34">
            <span class="send_name">Название рассылки:</span>
            <input v-model="send_name" class="send_name" placeholder="Моя рассылка" />
        </div>
        <div class="new_send_row m30">
            <span class="new_send_row_filters">Фильтры</span>
            <div class="new_send_col">
                <div class="new_send_filter_settings" v-if="isAddFilter">
                    <div class="filters">
                        <div
                            v-for="(item, index) in filters" 
                            :key="index"
                            class="filters_item"
                        >
                            <div class="filter_item_tags_row">
                                <h3>{{ item.name }}</h3>
                                <img src="@/assets/images/close.png" class="delete_tag" @click="deleteFilter(index)"/>
                            </div>
                            <div class="filter_item_tags_row">
                                <div 
                                    v-for="(tag, index_tag) in item.tags"
                                    :key="index_tag"
                                    class="filter_item_tag"
                                >
                                    {{ tag }}
                                    <img src="@/assets/images/close.png" class="delete_tag" @click="deleteTag(index, index_tag)"/>
                                </div>
                            </div>
                            <input 
                                v-model="newTagValues[index]"
                                @keydown.enter="handleEnter(index)" 
                                class="tag_input"
                            />
                            <AppBadButton
                                v-if="!(userTags.length == 1 && userTags[0] == '')"
                                :text="'+ ДОБАВИТЬ'" 
                                class="add_tag_btn" 
                                @click="openNewTags(index)"
                            />
                            <div class="dropdown_tags" v-if="isNewTags == index">
                                <div 
                                    v-for="(tag, tag_index) in userTags.filter(tag => !item.tags.includes(tag))"
                                    :key="tag_index"
                                    class="dropdown_tag"
                                    @click="addTag(index, tag)"
                                >
                                    {{ tag }}
                                </div>
                            </div>
                            <div class="dropdown" v-if="filter_connection.length > 0 && filter_connection[index]">
                                <input
                                    v-model="filter_connection[index]"
                                    type="text"
                                    @focus="dropdownLogic = index"
                                    @blur="hideDropdownLogic"
                                    readonly 
                                />
                                <img :class="{'rotated': dropdownLogic == index}" src="@/assets/images/arrow_down.png" class="arrow_down">
                                <ul v-if="dropdownLogic == index" class="dropdown-menu">
                                    <li
                                        @mousedown.prevent="selectFilterConnection('И', index)"
                                    >
                                        {{ 'И' }}
                                    </li>
                                    <li
                                        @mousedown.prevent="selectFilterConnection('ИЛИ', index)"
                                    >
                                        {{ 'ИЛИ' }}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="new_send_filter_settings_row" v-if="isAddSubFilter" style="background: #1B1E3D;">
                        <div class="filter_contain" @click="addFilter('Содержит теги')">Содержит теги</div>
                        <div class="filter_notcontain" @click="addFilter('Не содержит теги')">Не содержит теги</div>
                    </div>
                    <div class="new_send_filter_settings_row">
                        <AppBadButton :text="'+ ДОБАВИТЬ ПОДФИЛЬТР'" class="add_subfilter" @click="openSubFilters " />
                    </div>
                </div>
                <AppBadButton :text="'+ ДОБАВИТЬ ФИЛЬТР'" class="add_filter" @click="changeIsAddFilter"/>
                <div class="new_send_row_sm">
                    <div class="checkbox-wrapper-18">
                        <div class="round">
                            <input type="checkbox" :id="`checkbox`" v-model="isAddContacts"/>
                            <label :for="`checkbox`"></label>
                        </div>
                    </div>
                    <span>Добавить в авторассылку текущие контакты</span>
                </div>
            </div>
        </div>
        <div class="new_send_row m48">
            <span class="new_send_row_copy"><strong>Копировать рассылку в:</strong></span>
            <div class="new_send_col">
                <div 
                    v-for="(item, index) in copyToManager.slice(0, managers.length)"
                    :key="index"
                    class="new_send_row_sm"
                >
                    <div class="checkbox-wrapper-18">
                        <div class="round">
                            <input 
                                type="checkbox" 
                                :id="`checkbox-${index}`" 
                                :checked="item" 
                                @change="updateCopyToManager(index, $event.target.checked)"
                            />
                            <label :for="`checkbox-${index}`"></label>
                        </div>
                    </div>
                    <span>{{ index + 1 }} ИИ менеджер</span>
                </div>
            </div>
        </div>
        <div class="new_send_footer">
            <AppGoodButton :text="'СОЗДАТЬ'" class="new_send_btn" @click="makeNew"/>
            <AppBadButton :text="'НАЗАД'" class="new_send_btn" @click="backup"/>
        </div>
        
    </section>
</template>

<script>
    import AppGoodButton from '@/components/AppGoodButton.vue';
    import AppBadButton from '@/components/AppBadButton.vue';
    import AppModal from '@/components/AppModal.vue';
    import AppAiManagerConfirmModal from '@/components/AppAiManagerConfirmModal.vue';
    import { 
        createCampaign, 
        copyCompaignTo, 
        addContactsToCampaign 
    } from '@/services/manager';

    export default {
        components: { AppGoodButton, AppBadButton, AppModal, AppAiManagerConfirmModal },
        props: {
            manager_id: String,
            user_id: String,
            userTags: Array,
            managers: Array
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
                activeIndex: 0,
                copyToManager: [false, false, false, false, false],
                isAddFilter: false,
                filters: [
                    /*
                        два варианта: содержит либо не содержит
                        {
                            name: "Содержит теги",
                            tags: ["tag1", "tag2" ...]
                        },
                        {
                            name: "Не содержит теги",
                            tags: ["tag1", "tag2" ...]
                        }
                    */
                ],
                filter_connection: [
                    /*
                        связки между подфильтрами
                        "и", "или"
                    */
                ],
                isAddSubFilter: false,
                dropdownLogic: -1,
                isNewTags: -1,
                send_name: "", 
                isAddContacts: false,
                title: "",
                msg: "",
                isModal: false,
                newTagValues: [],
                isConfirmModal: false,
                managerCopyId: null
            }
        },
        mounted() {
            document.addEventListener('click', this.handleClickOutside);
        },
        beforeUnmount() {
            document.removeEventListener('click', this.handleClickOutside);
        },
        methods: {
            deleteFilter(index) {
                this.filters.splice(index, 1);
                if (this.filter_connection.length > 0) this.filter_connection.splice(Math.max(0, index - 1), 1);
            },
            cancelCopy() {
                this.copyToManager[this.managerCopyId] = false;
                this.isConfirmModal = false;
            },
            handleEnter(index) {
                const value = this.newTagValues[index]?.trim();
                console.log(this.newTagValues);
                if (value) {
                    // Инициализируем массив tags, если он не определён
                    if (!Array.isArray(this.filters[index].tags)) {
                        this.filters[index].tags = []; // Простая инициализация
                    }

                    // Добавляем значение в массив tags
                    this.filters[index].tags.push(value);

                    // Очищаем поле ввода
                    this.newTagValues[index] = '';

                    // Если нужно сохранять состояние или делать что-то еще
                    // this.captureState(); // если у вас есть такой метод
                }
            },
            updateCopyToManager(index, isChecked) {
                this.isConfirmModal = true;
                if (isChecked) {
                    this.msg = "Вы подтверждаете копирование рассылки?";
                    this.copyToManager[index] = isChecked;
                    this.managerCopyId = index;
                }
                
            },
            backup() {
                this.$emit('backup');
                console.log('назад');
            },
            async makeNew() {
                this.title = 'ОЖИДАНИЕ';
                this.msg = 'Подождите, пока создается рассылка';
                this.isModal = true;
                const resp = await createCampaign(this.manager_id, this.user_id, this.send_name, this.filters, this.filter_connection, this.isAddContacts, this.copyToManager, false);
                if (resp) {
                    const isCopy = await copyCompaignTo(this.manager_id, resp.campaign_id, this.copyToManager);
                    const isContact = await addContactsToCampaign(this.manager_id, resp.campaign_id);
                    if (isCopy && isContact) {
                        this.title = 'ОЖИДАНИЕ';
                        this.msg = 'Подождите, пока создается рассылка';
                        this.isModal = true;
                        setTimeout(() => this.$emit('isMaded'), 2000);
                    } else {
                        this.title = 'ОШИБКА';
                        this.msg = 'При создании рассылки произошла ошибка. Попробуйте еще раз или обратитесь в техническую поддержку.';
                    }
                } 
            },
            handleClickOutside(event) {
                const clickedEl = event.target;
                if (!clickedEl.closest('.dropdown_tag_wrapper') && !clickedEl.closest('.add_tag_btn') && this.isNewTags != -1) {
                    this.closeNewTags();
                }
            },
            deleteTag(index, tag_index) {
                this.filters[index].tags.splice(tag_index, 1);
            },
            openNewTags(index) {
                this.isNewTags = index;
            }, 
            closeNewTags() {
                this.isNewTags = -1;
            } ,
            addTag(index, tag) {
                this.filters[index].tags.push(tag);
                this.closeNewTags();
            },
            openSubFilters() {
                this.isAddSubFilter = true;
            },
            selectFilterConnection(name, index) {
                this.filter_connection[index] = name;
                this.hideDropdownLogic();
            },
            hideDropdownLogic() {
                this.dropdownLogic = -1;
            },
            addFilter(name) {
                this.filters.push({
                    name: name, 
                    tags: []
                });
                if (this.filters.length > 1) this.filter_connection.push('И');
                this.isAddSubFilter = false;
            },
            changeIsAddFilter() {
                this.isAddFilter = !this.isAddFilter;
                this.isAddSubFilter = !this.isAddSubFilter;
            },
            setActive(index) {
                this.activeIndex = index;
            },
        }
    };
</script>

<style scoped>
    .tag_input {
        height: 32px;
        width: 60%;
    }
    .m34 {
        margin-top: 34px;
    }
    .m30 {
        margin-top: 30px;
    }
    .m48 {
        margin-top: 48px;
    }
    h2 {
        font-size: 24px;
        color: white;
        font-family: 'OpenSans';
    }
    .send_name {
        white-space: nowrap;
    }
    .managers_switch {
        display: flex;
        column-gap: 21px;
        align-items: center;
        margin-top: 57px;
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
    .new_send {
        display: flex;
        flex-direction: column;
    }
    .new_send_row {
        display: flex;
        column-gap: 20px;
        align-items: center;
        width: 100%;
    }
    .new_send_row span {
        font-size: 18px;
        color: white;
        font-family: 'OpenSans';
    }
    input {
        width: 100%;
        height: 60px;
        padding: 0 20px;
        box-sizing: border-box;
        font-size: 16px;
        color: rgba(255, 255, 255, 0.5);
        background: none;
        border: 1px solid white;
        border-radius: 10px;
        font-family: 'OpenSans';
        position: relative;
        transition: .2s ease-in;
        @media (max-width: 650px) {
            height: 50px;
        }
    }
    .new_send_col {
        display: flex;
        flex-direction: column;
        row-gap: 31px;
    }
    .add_filter {
        width: 220px;
        height: 51px;
    }
    .new_send_row_sm {
        display: flex;
        column-gap: 6.82px;
        align-items: center;
    }
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
    .new_send_row_filters {
        align-self: start;
        margin-top: 13px;
    }
    .new_send_row_copy {
        align-self: start;
    }
    .new_send_footer {
        display: flex;
        justify-content: space-between;
        width: 100%;
        margin-top: 50px;
    }
    .new_send_btn {
        width: 150px;
        height: 51px;
    }
    .new_send_filter_settings {
        width: 471px;
        background: #111433;
        border-radius: 10px;
    }
    .new_send_filter_settings_row {
        width: 100%;
        padding: 20px 30px 28px 30px;
        display: flex;
        justify-content: space-between;
    }
    .filter_contain {
        width: 176px;
        height: 35px;
        background: #2F3251;
        color: white;
        font-size: 16px;
        font-family: 'OpenSans';
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .filter_notcontain {
        width: 205px;
        height: 35px;
        background: #2F3251;
        color: white;
        font-size: 16px;
        font-family: 'OpenSans';
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .add_subfilter {
        width: 155px;
        height: 32px;
        font-size: 9.88px;
        cursor: pointer;
        letter-spacing: 0px;
    }
    .filters {
        display: flex;
        flex-direction: column;
        row-gap: 20px;
        padding: 20px;
    }
    .filters_item {
        display: flex;
        flex-direction: column;
        row-gap: 14px;
        position: relative;
    }
    .filters_item h3 {
        font-size: 16px;
        color: white;
        font-family: 'OpenSans';
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
    .delete_filter {
        width: 20px;
        object-fit: contain;
        cursor: pointer;
    }
    .delete_tag {
        width: 9px;
        object-fit: contain;
        cursor: pointer;
    }
    .add_tag_btn {
        width: 92px;
        height: 32px;
        font-size: 9.98px;
        letter-spacing: 0px;
    }
    .dropdown {
        position: relative;
        width: 110px;
        height: 32px;
        display: flex;
        align-items: center;
        margin-top: 10px;
        font-size: 10px;
    }
    .dropdown input {
        height: 32px !important;
        font-size: 10px !important;
        border: .62px solid white !important;
        padding: 0 10px !important;
    }
    .arrow_down {
        position: absolute;
        right: 8px;
        transition: transform 0.3s ease;
        width: 8px;
        height: 8px;
    }

    .arrow_down.rotated {
        transform: rotate(180deg);
    }

    .dropdown-menu {
        position: absolute;
        top: 100%;
        width: 100%;
        border: .62px solid white;
        border-radius: 0px 0px 10px 10px;
        max-height: 200px;
        overflow-y: scroll;
        list-style: none;
        margin: 0;
        padding: 0;
        z-index: 1000;
        color: rgba(255, 255, 255, 0.5);
        font-size: 10px;
        font-weight: normal;
        letter-spacing: 1px;
        scrollbar-width: none;
        z-index: 15;
    }
    .dropdown::-webkit-scrollbar {
        width: 0;  
        height: 0;
    }

    .dropdown::-webkit-scrollbar-thumb {
        background: transparent;
    }

    .dropdown-menu li {
        padding: 10px;
        cursor: pointer;
        border-bottom: .62px solid white;
        background: #070a29;
        font-family: 'OpenSans'
    }

    .dropdown-menu li:hover {
        background: #0c103e;
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
</style>