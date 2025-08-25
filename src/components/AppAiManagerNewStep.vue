<template>
    <div class="new_step">
        <h2>Создание шага</h2>
        <div class="row">
            <span>Имя</span>
            <input v-model="name" type="text"/>
        </div>
        <div class="row">
            <span>Заголовок</span>
            <input v-model="title" type="text" />
        </div>
        <div class="row">
            <span>Текст</span>
            <AppAiTextEditor class="editor" @update="text = $event" :startText="text" />
        </div>
        <div class="row" v-if="previews.length == 0">
            <span>Изображение</span>
            <!-- From Uiverse.io by csemszepp --> 
            <label 
                for="file"
                class="custum-file-upload"
                @dragover.prevent="onDragOver"
                @dragleave.prevent="onDragLeave"
                @drop.prevent="onDrop"
                :class="{ 'dragover': isDragging }"
            >
                <div class="icon">
                    <img src="@/assets/images/upload.png" />
                </div>
                <div class="text">
                    <span>Перетащите файлы сюда</span>
                </div>
                <input
                    id="file"
                    type="file"
                    accept="image/*"
                    @change="onFileChange"
                    ref="fileInput"
                    hidden
                />
            </label>

        </div>
        <div class="preview-list" v-if="previews.length">
            <div class="preview-item" v-for="(src, index) in previews" :key="index">
                <img :src="src" alt="Preview" />
            </div>
            <div class="preview_btns">
                <AppBadButton :text="'ИЗМЕНИТЬ'" @click="deletePreview" class="preview_btn"/>
                <AppBadButton :text="'УДАЛИТЬ'" @click="deletePreview" class="preview_btn" />
            </div>
        </div>
        <div class="row" v-if="isFirstStep">
            <span>Отправить</span>
            <div class="row_sm types">
                <div class="dropdown">
                    <input
                        v-model="type"
                        type="text"
                        placeholder="Тип программы"
                        @focus="isDropdownVisible = true"
                        @blur="hideDropdown"
                        readonly 
                    />
                    <img :class="{'rotated': isDropdownVisible}" src="@/assets/images/arrow_down.png" class="arrow_down">
                    <ul v-if="isDropdownVisible" class="dropdown-menu">
                        <li
                            v-for="(item, index) in types"
                            :key="index"
                            @mousedown.prevent="selectType(item, index)"
                            :class="{ bold: index == activeIndex }"
                        >
                            {{ item }}
                        </li>
                    </ul>
                </div>
                <div class="datetime-wrapper" v-if="['в точное время', 'в точное время на следующий день', 'в точную дату'].indexOf(type) != -1">
                    <input
                        ref="datetimeInput"
                        v-model="date"
                        type="datetime-local"
                        @input="onDateChange"
                        class="datetime"
                    />
                    <img
                        src="@/assets/images/time.png"
                        class="calendar-icon"
                        @click="openPicker"
                    />
                </div>
            </div>
        </div>
        <div class="row" v-if="!isFirstStep">
            <span>Отправить через</span>
            <div class="row_sm">
                <input type="text" class="amountOfTime" v-model="amountOfTime" />
                <div class="dropdown">
                    <input
                        v-model="timeRange"
                        type="text"
                        @focus="isTimeRangeVisible = true"
                        @blur="closeTimeRange"
                        readonly 
                    />
                    <img :class="{'rotated': isTimeRangeVisible}" src="@/assets/images/arrow_down.png" class="arrow_down">
                    <ul v-if="isTimeRangeVisible" class="dropdown-menu">
                        <li
                            v-for="(item, index) in timeRanges"
                            :key="index"
                            @mousedown.prevent="selectTimeRange(item, index)"
                            :class="{ bold: index == activeIndexTimeRange }"
                        >
                            {{ item }}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="new_send_footer">
            <AppGoodButton v-if="!editData"  :text="'СОЗДАТЬ'" class="new_send_btn" @click="createNewStep"/>
            <AppGoodButton v-if="editData"  :text="'СОХРАНИТЬ'" class="new_send_btn" @click="saveStep"/>
            <AppBadButton :text="'НАЗАД'" class="new_send_btn" @click="backup"/>
        </div>
    </div>
</template>

<script>
    import AppGoodButton from '@/components/AppGoodButton.vue';
    import AppBadButton from '@/components/AppBadButton.vue';
    import AppAiTextEditor from '@/components/AppAiTextEditor.vue';
    import { 
        createCampaignStep, 
        getCompaignStep,
        saveStepSettings
    } from '@/services/manager';
    import { loadImage } from '@/services/other';

    export default {
        components: { AppGoodButton, AppBadButton, AppAiTextEditor },
        props: {
            isFirstStep: Boolean,
            editData: Object,
            campaignData: Object,
        },
        data() {
            return {
                isDropdownVisible: false,
                type: null,
                types: ['немедленно', 'минута', 'час', 'день', 'в точное время', 'в точное время на следующий день', 'в точную дату'],
                activeIndex: -1,
                isDragging: false,
                previews: [],
                name: '',
                title: '',
                text: 'Ваш текст',
                amountOfTime: 1,
                timeRanges: ['минута', 'час', 'день', 'месяц', ],
                activeIndexTimeRange: 0,
                timeRange: 'минута',
                isTimeRangeVisible: false,
                date: '',
                files: [],
                step_id: null
            }
        },
        watch: {
            editData: {
                async handler(val) {
                if (val) {
                    this.step_id = val.step_id;
                    const resp = await getCompaignStep(val.step_id);
                    this.name = resp.name;
                    this.title = resp.title;
                    this.text = resp.text_html;
                    this.previews = [];
                    if (resp.image_url) this.previews.push(resp.image_url);
                    if (resp.delay.time > 1000) {
                        this.type = resp.delay.type;
                        this.date = this.formatedDate(resp.delay.time * 1000);
                    } else {
                        this.timeRange = resp.delay.type;
                        this.amountOfTime = resp.delay.time;
                    }
                }
                },
                immediate: true,
            }
        },
        created() {
            setTimeout(() => {
                const el = document.querySelector('.ck-editor');
                const el2 = document.querySelector('.ck-content');
                if (el) el.style.width = '100%';
                if (el2) {
                    el2.style.height = '280px';
                } 
            }, 1000);
            
        },
        methods: {
            async saveStep() {
                let send_time;
                if (this.isFirstStep) {
                    const dt = new Date(this.date);
                    send_time = {
                        "first": this.isFirstStep, 
                        "first_type": this.type,
                        "first_time": Math.ceil(dt.getTime() / 1000)
                    };
                } else {
                    send_time = {
                        "first": this.isFirstStep, 
                        "second_type": this.timeRange,
                        "second_time": this.amountOfTime
                    };
                }
                let image_link = "";
                if (this.files.length > 0) {
                    const image = await loadImage(this.files[0]);
                    image_link = image.image_id;
                } else {
                    image_link = this.previews[0] || "";
                }
                const resp = await saveStepSettings(this.step_id, this.name, this.title, this.text, image_link, send_time);
                if (resp) this.$emit('create_new_step');
            },
            formatedDate(time) {
                const date = new Date(time);

                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');

                return `${year}-${month}-${day}T${hours}:${minutes}`;
            },
            onDateChange() {
                console.log(this.date);
            },
            backup() {
                this.$emit('backup');
            },
            async createNewStep() {
                let send_time;
                if (this.isFirstStep) {
                    const dt = new Date(this.date);
                    send_time = {
                        "first": this.isFirstStep, 
                        "first_type": this.type,
                        "first_time": Math.ceil(dt.getTime() / 1000)
                    };
                } else {
                    send_time = {
                        "first": this.isFirstStep, 
                        "second_type": this.timeRange,
                        "second_time": this.amountOfTime
                    };
                }
                let image_link = "";
                if (this.files.length > 0) {
                    const image = await loadImage(this.files[0]);
                    image_link = image.image_id;
                }
                const resp = await createCampaignStep(this.campaignData.campaign_id, this.name, this.title, this.text, image_link, send_time);
                if (resp) this.$emit('create_new_step');
            },
            closeTimeRange() {
                this.isTimeRangeVisible = false;
            },
            selectTimeRange(item, index) {
                this.timeRange = item;
                this.activeIndexTimeRange = index;
                this.closeTimeRange();
            },
            deletePreview() {
                this.previews = [];
                this.files = [];
            },
            openPicker() {
                const input = this.$refs.datetimeInput;
                if (input.showPicker) {
                    input.showPicker();
                } else {
                    input.focus(); // fallback
                }
            },
            onDragOver() {
                this.isDragging = true;
            },
            onDragLeave() {
                this.isDragging = false;
            },
            onDrop(e) {
                this.isDragging = false;
                const files = e.dataTransfer.files;
                if (files.length) {
                this.$refs.fileInput.files = files;

                // вручную вызвать обработчик (если надо)
                this.onFileChange({ target: { files } });
                }
            },
            onFileChange(event) {
                const files = Array.from(event.target.files);

                // Очистим старые превью
                this.previews = [];

                files.forEach(file => {
                if (file.type.startsWith('image/')) {
                    this.files.push(file);
                    const reader = new FileReader();
                    reader.onload = e => {
                    this.previews.push(e.target.result);
                    };
                    reader.readAsDataURL(file);
                }
                });
            },
            hideDropdown() {
                this.isDropdownVisible = false;
            },
            selectType(item, index) {
                this.type = item;
                this.activeIndex = index;
                this.hideDropdown();
            },
        }
    };
</script>

<style scoped>
    :root {
        --ck-color-base-background: #434665;
    }
    .types {
        @media (max-width: 650px) {
            flex-direction: column;
            row-gap: 10px;
        }
    }
    .amountOfTime {
        width: 80px !important;
        @media (max-width: 650px) {
            width: 50px !important;
            height: 50px;
        }
    }
    .preview_btn {
        width: 150px;
        height: 51px;
    }
    .preview_btns {
        display: flex;
        flex-direction: column;
        row-gap: 30px;
        @media (max-width: 650px) {
            flex-direction: row;
            flex-wrap: wrap;
            width: 100%;
            justify-content: space-between;
            column-gap: 10px;
        }
    }
    .ck-editor__editable {
        background-color: #1b1e3c;
        color: white;
        min-height: 150px;
        border-radius: 8px;
        padding: 10px;
    }
    .datetime-wrapper {
        position: relative;
        display: inline-block;
        width: fit-content;
        @media (max-width: 650px) {
            width: 100%;
        }
    }

    .datetime {
        padding-left: 60px; /* чтобы не перекрылась иконкой */
        color: white;
        background: transparent;
        border: 1px solid white;
        font-size: 18px;
        border-radius: 10px;
        @media (max-width: 650px) {
            font-size: 12px;
        }
    }

    /* Убираем встроенную иконку календаря (в Chrome/Webkit) */
    .datetime::-webkit-calendar-picker-indicator {
        opacity: 0;
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        cursor: pointer;
    }

    /* Иконка поверх */
    .calendar-icon {
        position: absolute;
        left: 20px; /* сдвинуть влево, если надо больше – увеличь */
        top: 50%;
        transform: translateY(-50%);
        width: 20px;
        height: 20px;
        cursor: pointer;
    }
    .preview-list {
        display: flex;
        gap: 10px;
        margin-top: 47px;
        flex-wrap: wrap;
        justify-content: space-between;
    }

    .preview-item img {
        max-width: 452px;
        max-height: 252px;
        object-fit: contain;
        @media (max-width: 650px) {
            width: 100%;
        }
    }
    .custum-file-upload.dragover {
        border: 2px dashed #4a90e2;
        background-color: #1b1e3d;
    }
    /* From Uiverse.io by csemszepp */ 
    .custum-file-upload {
        height: 200px;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: space-between;
        gap: 20px;
        cursor: pointer;
        align-items: center;
        justify-content: center;
        border: 2px dashed #e8e8e8;
        background-color: none;
        padding: 1.5rem;
        border-radius: 10px;
        @media (max-width: 650px) {
            height: 150px;
        }
    }

    .custum-file-upload .icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 55px;
        height: 55px;
        border-radius: 50%;
        background: #1B1E3D;
    }

    .custum-file-upload .icon img {
        width: 25px;
        height: 25px;
    }

    .custum-file-upload .text {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .custum-file-upload .text span {
        font-size: 18px;
        font-family: 'OpenSans';
        color: rgba(255, 255, 255, 0.3);
        @media (max-width: 650px) {
            font-size: 16px;
        }
    }

    .custum-file-upload input {
        display: none;
    }
    .new_send_footer {
        display: flex;
        justify-content: space-between;
        width: 100%;
        margin-top: 50px;
        @media (max-width: 650px) {
            margin-top: 20px;
        }
    }
    .new_send_btn {
        width: 150px;
        height: 51px;
        @media (max-width: 650px) {
            width: 160px;
            height: 40px;
            font-size: 14px;
            letter-spacing: 0px;
        }
    }
    .row_sm {
        display: flex;
        column-gap: 20px;
        @media (max-width: 650px) {
            width: 100%;
            column-gap: 10px;
        }
    }
    .row span {
        font-size: 18px;
        color: white;
        font-family: 'OpenSans';
        @media (max-width: 650px) {
            font-size: 14px;
        }
    }
    .row {
        display: grid;
        grid-template-columns: 155px 1fr;
        margin-top: 30px;
        align-items: center;
        column-gap: 30px;
        @media (max-width: 650px) {
            width: 100%;
            display: flex;
            flex-direction: column;
            row-gap: 10px;
            margin-top: 20px;
            align-items: start;
        }
    }
    h2 {
        font-size: 24px;
        color: white;
        font-family: 'OpenSans';
        @media (max-width: 650px) {
            font-size: 18px;
        }
    }
    .new_step {
        display: flex;
        flex-direction: column;
    }
    .bold {
        font-weight: bold;
    }
    .dropdown {
        position: relative;
        width: 100%
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
            font-size: 12px !important;
        }
    }
    textarea {
        width: 100%;
        height: 190px;
        padding: 20px;
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
            height: 160px;
            padding: 10px;
        }
    }

    .arrow_down {
        position: absolute;
        top: 23px;
        right: 23px;
        width: 13px;
        height: 13px;
        transition: transform 0.3s ease;
    }

    .arrow_down.rotated {
        transform: rotate(180deg);
    }

    .dropdown-menu {
        position: absolute;
        width: 100%;
        max-height: 290px;
        background: #434665;
        overflow-y: scroll;
        list-style: none;
        margin: 0;
        padding: 0;
        z-index: 1000;
        color: white;
        font-size: 15px;
        font-weight: normal;
        letter-spacing: 1px;
        scrollbar-width: none;
        z-index: 15;
        padding: 0px 20px;
        @media (max-width: 650px) {
            font-size: 12px;
        }
    }
    .dropdown::-webkit-scrollbar {
        width: 0;  
        height: 0;
    }

    .dropdown::-webkit-scrollbar-thumb {
        background: transparent;
    }

    .dropdown-menu li {
        cursor: pointer;
        border-bottom: 1px solid rgba(255, 255, 255, 0.3);
        font-family: 'OpenSans';
        padding: 10px 0px;
    }
    .dropdown-menu li:last-of-type {
        border-bottom: none;
    }
</style>