<template>
    <AppAiManagerNewStep 
        v-if="isNewStep" 
        :isFirstStep="steps.length == 0 || firstStep" 
        :editData="editStep"
        @backup="isNewStep = false"
        @create_new_step="updateSteps"
    />
    <section class="send_info" v-if="!isNewStep">
        <h2>Информация о рассылке</h2>
        <div class="managers_switch">
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
        </div>
        <div class="stats">
            <div class="stats_card">
                <div class="stats_card_header">Подписчики</div>
                <span class="stats_card_num">{{ sendData.subs }}</span>
            </div>
            <div class="stats_card">
                <div class="stats_card_header">Отписки</div>
                <span class="stats_card_num">{{ sendData.unsubs }}</span>
            </div>
            <div class="stats_card">
                <div class="stats_card_header">Конверсия</div>
                <span class="stats_card_num">{{ sendData.conv }}</span>
            </div>
        </div>
        <div class="menu">
            <div class="menu_header">
                <div class="menu_header_back" @click="backup">
                    <img src="@/assets/images/arrow.png" class="menu_header_back_arrow">
                    <span>Назад</span>
                </div>
                <div class="menu_header_nav">
                    <span :class="{ activeMenuHeader: menuHeaderIndex == 0 }" @click="menuHeaderSetter(0)">Настройки</span>
                    <span :class="{ activeMenuHeader: menuHeaderIndex == 1 }" @click="menuHeaderSetter(1)">Шаги</span>
                    <span :class="{ activeMenuHeader: menuHeaderIndex == 2 }" @click="menuHeaderSetter(2)">Аудитория ({{ sendData.subs }})</span>
                </div>
            </div>
            <AppGoodButton :text="'ДОБАВИТЬ ШАГ'" v-if="steps.length == 0" class="add_step" @click="openNewStep"/>
            <div class="steps" v-if="menuHeaderIndex == 1 && steps.length > 0">
                <div class="steps_header">
                    <span style="justify-self: center;">Имя</span>
                    <span>Сценарий</span>
                    <span>Задержка/Время</span>
                    <span>Статистика</span>
                </div>
                <div 
                    v-for="(step, index) in steps"
                    :key="index"
                    class="step"
                >
                    <div class="step_name">
                        <img src="@/assets/images/squares.png" />
                        <span>{{ step.name }}</span>
                    </div>
                    <span>{{ step.scene }}</span>
                    <span>{{ step.time }}</span>
                    <div class="step_end">
                        <span>{{ step.stats.subs }} · {{ step.stats.unsubs }} · {{ step.stats.conv }}</span>
                        <div class="step_icons">
                            <img src="@/assets/images/manager_edit.png" @click="edit(step, index)"/>
                            <img src="@/assets/images/trash.png" @click="deleteStep(index)"/>
                        </div>
                    </div>
                </div>
                <div class="steps_btns">
                    <AppGoodButton :text="'ДОБАВИТЬ ШАГ'" class="addNextStep" @click="openNewStep" />
                    <AppGoodButton :text="'ЗАПУСТИТЬ'" v-if="!sendData.status" class="startStep" />
                    <AppGoodButton :text="'ОСТАНОВИТЬ'" v-else class="stopStep" />
                </div>
            </div>
            <div class="settings" v-if="menuHeaderIndex == 0 && steps.length > 0">
                <div class="settings_row">
                    <span>Название рассылки:</span>
                    <input v-model="name" />
                </div>
                <div class="new_send_row" style="align-items: self-start; margin-top: 30px;">
                    <span class="new_send_row_filters">Фильтры</span>
                    <div class="new_send_col">
                        <div class="new_send_filter_settings" v-if="isAddFilter">
                            <div class="filters">
                                <div
                                    v-for="(item, index) in filters" 
                                    :key="index"
                                    class="filters_item"
                                >
                                    <h3>{{ item.name }}</h3>
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
                                    <AppBadButton :text="'+ ДОБАВИТЬ'" class="add_tag_btn" @click="openNewTags(index)"/>
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
                                    <input type="checkbox" :id="`checkbox`" v-model="isAddInSends" />
                                    <label :for="`checkbox`"></label>
                                </div>
                            </div>
                            <span>Добавить в авторассылку текущие контакты</span>
                        </div>
                    </div>
                </div>
                <div class="settings_row" style="margin-top: 48px;">
                    <span>Копировать рассылку в:</span>
                    <div class="new_send_col">
                        <div 
                            v-for="(item, index) in managers"
                            :key="index"
                            class="new_send_row_sm"
                        >
                            <div class="checkbox-wrapper-18">
                                <div class="round">
                                    <input type="checkbox" :id="`checkbox-${index}`" :checked="item"/>
                                    <label :for="`checkbox-${index}`"></label>
                                </div>
                            </div>
                            <span>{{ index + 1 }} ИИ менеджер</span>
                        </div>
                    </div>
                </div>
                <div class="steps_btns" style="margin-top: 40px;">
                    <AppGoodButton :text="'ДОБАВИТЬ ШАГ'" class="addNextStep" @click="openNewStep" />
                    <AppGoodButton :text="'ЗАПУСТИТЬ'" v-if="!sendData.status" class="startStep" />
                    <AppGoodButton :text="'ОСТАНОВИТЬ'" v-else class="stopStep" />
                    <AppGoodButton :text="'ПЕРЕЗАПУСТИТЬ'" class="stopStep" style="width: 135px;" />
                </div>
            </div>
            <div class="audience" v-if="menuHeaderIndex == 2">
                <div class="radios">
                    <div class="radios_item"  
                        v-for="(radio, index) in radios" 
                        :key="index"
                        @click="changeActiveRadio(index, radio)"
                    >
                        <div class="check" :class="{ activeBinar: radio_index == index  }"></div>
                        <span>{{ radio }}</span>
                    </div>
                </div>
                <div class="autosend_body">
                    <div class="autosend_body_row nothover">
                        <h3 class="op50">Имя</h3>
                        <h3 class="op50">Шаг</h3>
                        <h3 class="op50">Статус</h3>
                        <h3 class="op50">Username</h3>
                        <h3 class="op50">Добавлен</h3>
                    </div>
                    <div 
                        v-for="(item, index) in paginatedData"
                        :key="index"
                        class="autosend_body_row"
                        :style="index == paginatedData.length - 1 ? 'border-bottom: none' : 'border-bottom: 1px solid rgba(255, 255, 255, 0.2)'"
                    >
                        <span>{{ item.name }}</span>
                        <span>{{ formatedDateNoHours(item.step) }}</span>
                        <span>{{ item.status }}</span>
                        <span>{{ item.username }}</span>
                        <span>{{ formatedDate(item.date) }}</span>
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
        </div>
        <div class="button_wrapper">
            <AppBadButton :text="'НАЗАД'" class="backup_btn" @click="backup"/>
        </div>
    </section>
    
</template>

<script>
    import AppGoodButton from '@/components/AppGoodButton.vue';
    import AppBadButton from '@/components/AppBadButton.vue';
    import AppAiManagerNewStep from '@/components/AppAiManagerNewStep.vue';

    export default {
        components: { AppGoodButton, AppBadButton, AppAiManagerNewStep },
        props: {
            sendData: Object
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
                steps: [
                    {
                        name: '111',
                        title: 'Заголовок',
                        text: 'Раз два три четыре пять',
                        image: 'https://sun6-22.vkuserphoto.ru/s/v1/ig2/LgVFW7BY5QJDAfIMu6FxBZ65WkxQIPs9-YVYQVGqdims6hVhlyD1HjUqSQFvUYDSXpid2Rgxm-PQLsAzYIlH2yiP.jpg?quality=95&crop=192,130,768,768&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720&ava=1&cs=200x200',
                        scene: 1,
                        time: '31 июля 2025, 13:36',
                        stats: {
                            subs: 0,
                            unsubs: 0,
                            conv: 0
                        }
                    },
                    {
                        name: '22',
                        title: 'Заголовок',
                        text: 'Раз два три четыре пять',
                        image: 'https://sun6-22.vkuserphoto.ru/s/v1/ig2/spP1ei8ErOIPpJ7MXBamz5tqj6q0DLTUu9Y4_YxoFjWgr_mDA7IshsqtNzfJRMHbLT6EEsiR-QHEVvx0cotvisze.jpg?quality=95&crop=107,110,857,857&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720&ava=1&cs=200x200',
                        scene: 2,
                        time: '1 день',
                        stats: {
                            subs: 0,
                            unsubs: 0,
                            conv: 0
                        }
                    },
                ],
                isNewStep: false,
                editStep: null,
                firstStep: false,
                menuHeaderIndex: 1,
                isAddFilter: false,
                isAddSubFilter: false,
                filters: null,
                isNewTags: -1,
                userTags: ["Книги", "Спорт", "Работа", "Продвижение", "Искусство"],
                filter_connection: null,
                dropdownLogic: -1,
                isAddInSends: false,
                managers: null,
                radio_index: 0,
                currRadio: null,
                radios: ["Все", "Активные", "Отписались"],
                currentPage: 1,
                pageSize: 7,
                audience: [
                    {
                        name: "Васильев Василий",
                        step: 0,
                        status: "Активный",
                        username: "@vasilevvas",
                        date: 1754489038186
                    },
                    {
                        name: "Петров Петр",
                        step: 1754489038186,
                        status: "Активный",
                        username: "@vasilevvas",
                        date: 1754489038186
                    },
                    {
                        name: "Алексеев Алексей",
                        step: 0,
                        status: "Отписались",
                        username: "@vasilevvas",
                        date: 1754489038186
                    },
                    {
                        name: "Васильев Василий",
                        step: 0,
                        status: "Активный",
                        username: "@vasilevvas",
                        date: 1754489038186
                    },
                    {
                        name: "Васильев Василий",
                        step: 0,
                        status: "Отписались",
                        username: "@vasilevvas",
                        date: 1754489038186
                    },
                    {
                        name: "Васильев Василий",
                        step: 0,
                        status: "Активный",
                        username: "@vasilevvas",
                        date: 1754489038186
                    },
                    {
                        name: "Васильев Василий",
                        step: 0,
                        status: "Активный",
                        username: "@vasilevvas",
                        date: 1754489038186
                    },
                    {
                        name: "Васильев Василий",
                        step: 0,
                        status: "Активный",
                        username: "@vasilevvas",
                        date: 1754489038186
                    },
                    {
                        name: "Васильев Василий",
                        step: 0,
                        status: "Активный",
                        username: "@vasilevvas",
                        date: 1754489038186
                    },
                    {
                        name: "Васильев Василий",
                        step: 0,
                        status: "Активный",
                        username: "@vasilevvas",
                        date: 1754489038186
                    },
                ],
                filter: ""
            }
        },
        watch: {
            sendData: {
                handler(val) {
                    if (val) {
                        this.filters = val.filters;
                        this.filter_connection = val.filter_connection;
                        this.isAddFilter = val.filters.length > 0;
                        this.isAddInSends = val.addInContact;
                        this.managers = val.copyTo;
                    }
                },
                immediate: true,
            }
        },
        computed: {
            totalPages() {
                return Math.ceil(this.audience.filter(item => this.filter == "" || item.status == this.filter).length / this.pageSize);
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
                return this.audience.slice(start, end).filter(item => this.filter == "" || item.status == this.filter);
            },
        },
        methods: {
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
            formatedDateNoHours(time) {
                if (time == 0) return '—';
                const date = new Date(time);

                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();

                return `${day}.${month}.${year}`;
            },
            changeActiveRadio(index, name) {
                this.radio_index = index;
                this.currRadio = name;
                this.filter = name == 'Активные' ? 'Активный' : name == 'Все' ? '' : 'Отписались';
                this.currentPage = 1;
            },
            openSubFilters() {
                this.isAddSubFilter = true;
            },
             addFilter(name) {
                this.filters.push({
                    name: name, 
                    tags: []
                });
                if (this.filters.length > 1) this.filter_connection.push('И');
                this.isAddSubFilter = false;
            },
            selectFilterConnection(name, index) {
                this.filter_connection[index] = name;
                this.hideDropdownLogic();
            },
            hideDropdownLogic() {
                this.dropdownLogic = -1;
            },
            closeNewTags() {
                this.isNewTags = -1;
            } ,
            addTag(index, tag) {
                this.filters[index].tags.push(tag);
                this.closeNewTags();
            },
            openNewTags(index) {
                this.isNewTags = index;
            }, 
            deleteTag(index, tag_index) {
                this.filters[index].tags.splice(tag_index, 1);
            },
            changeIsAddFilter() {
                this.isAddFilter = !this.isAddFilter;
                this.isAddSubFilter = !this.isAddSubFilter;
            },
            menuHeaderSetter(index) {
                this.menuHeaderIndex = index;
            },
            updateSteps() {
                this.isNewStep = false;
            },
            edit(step, index) {
                this.editStep = step;
                this.firstStep = index == 0;
                this.isNewStep = true;
            },
            deleteStep(index) {
                this.steps.splice(index, 1);
            },
            openNewStep() {
                this.isNewStep = true;
            },
            backup() {
                this.$emit('backup');
            }
        }
    };
</script>

<style scoped>
    .op50 {
        opacity: .5;
    }
    .autosend_body {
        display: flex;
        flex-direction: column;
        width: 100%;
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
        column-gap: 50px;
        padding-left: 80px;
    }
    .autosend_body_row:nth-child(2n + 1) {
        background: #252847;
    }
    .autosend_body_row:nth-child(1) {
        background: none !important;
    }
    /* .autosend_body_row:hover {
        background: #252847;
    } */
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
    .radios_item {
        display: flex;
        align-items: center;
        column-gap: 14px;
    }
    .check {
        width: 18px;
        height: 18px;
        outline: 1px solid white;
        outline-offset: 6px;
        border-radius: 50%;
        transition: .2s ease-in;
        cursor: pointer;
    }
    .activeBinar {
        background: white;
    }
    .radios_item span {
        font-size: 18px;
        color: white;
        font-family: 'OpenSans';
        @media (max-width: 650px) {
            font-size: 16px;
        }
    }
    .radios {
        display: flex;
        align-items: center;
        column-gap: 40px;
        margin-left: 51px;
    }
    .audience {
        display: flex;
        flex-direction: column;
        width: 100%;
        padding: 30px 0px;
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
    .new_send_col {
        display: flex;
        flex-direction: column;
        row-gap: 31px;
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
    .settings_row input {
        width: 535px;
        height: 60px;
        border-radius: 10px;
        border: 1px solid white;
        font-size: 16px;
        color: white;
        font-family: 'OpenSans';
        padding-left: 30px;
        background: none;
    }
    .settings_row span {
        font-size: 18px;
        color: white;
        font-family: 'OpenSans';
    }
    .settings_row {
        display: flex;
        column-gap: 20px;
        align-items: center;
    }
    .settings {
        padding: 52px 50px;
        display: flex;
        flex-direction: column;
        width: 100%;
    }
    .activeMenuHeader {
        background: #393C5B;
    }
    .step_end {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
    }
    .startStep {
        background: #16A253;
    }
    .stopStep {
        background: #A21619;
    }
    .addNextStep, .startStep, .stopStep {
        width: 120px;
        height: 35px;
        font-size: 10px;
        letter-spacing: 0px;
        border-radius: 5px;
    }
    .startStep:hover {
        background: #25db74;
    }
    .stopStep:hover {
        background: #ef2a2d;
    }
    .steps_btns {
        display: flex;
        column-gap: 20px;
        margin-top: 26px;
        align-self: self-start;
    }
    .step_icons img {
        width: 15px;
        height: 15px;
        cursor: pointer;
    }
    .step_icons {
        display: flex;
        align-items: center;
        column-gap: 10px;
        margin-right: 10px;
    }
    .step span {
        font-size: 16px;
        color: white;
        font-family: 'OpenSans';
        font-weight: 500;
    }
    .step_name img {
        width: 8px;
        height: 8px;
    }
    .step_name {
        display: flex;
        align-items: center;
        column-gap: 10px;
        margin-left: 79px;
    }
    .step {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        padding: 10px 0px;
    }
    .steps_header span {
        font-size: 16px;
        color: rgba(255, 255, 255, 0.5);
        font-family: 'OpenSans';
        font-weight: 500;
    }
    .steps_header {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        padding-bottom: 20px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.3);
    }
    .steps {
        margin-top: 50px;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0px 30px 50px 30px;
    }
    .backup_btn {
        width: 150px;
        height: 51px;
    }
    .button_wrapper {
        width: 100%;
        display: flex;
        justify-content: end;
        margin-top: 50px;
    }
    .add_step {
        width: 166px;
        height: 45px;
        font-size: 14px;
        align-self: center;
        margin: 37px 0px;
    }
    .menu_header_nav span {
        font-size: 16px;
        color: white;
        font-family: 'OpenSans';
        font-weight: 500;
        cursor: pointer;
        padding: 10px 18px;
    }
    .menu_header_nav {
        display: flex;
        align-items: center;
    }
    .menu_header_back span {
        font-size: 16px;
        color: white;
        opacity: .5;
        font-family: 'OpenSans';
        font-weight: 500;
    }
    .menu_header_back_arrow {
        width: 30px;
        transform: rotate(180deg);
        opacity: .5;
    }
    .menu_header_back {
        position: absolute;
        left: 30px;
        top: 19px;
        display: flex;
        column-gap: 20px;
        align-items: center;
        cursor: pointer;
    }
    .menu_header {
        position: relative;
        display: flex;
        justify-content: center;
        padding: 10px 30px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.3);
    }
    .menu {
        margin-top: 25px;
        display: flex;
        flex-direction: column;
        background: #1B1E3D;
        border-radius: 10px;
    }
    .stats_card_num {
        font-size: 64px;
        color: white;
        font-family: 'OpenSans';
        padding: 10px 22px 16px 22px;
    }
    .stats_card_header {
        font-size: 16px;
        color: white;
        font-family: 'OpenSans';
        padding: 20px 20px 30px 22px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.3);
    }
    .stats_card {
        display: flex;
        flex-direction: column;
        background: #1B1E3D;
        border-radius: 10px;
    }
    .stats {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        column-gap: 25px;
        width: 100%;
        margin-top: 50px;
    }
    .send_info {
        width: 100%;
        display: flex;
        flex-direction: column;
    }
    h2 {
        font-size: 24px;
        color: white;
        font-family: 'OpenSans';
    }
    .managers_switch {
        display: flex;
        column-gap: 21px;
        align-items: center;
        margin-top: 50px;
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
</style>