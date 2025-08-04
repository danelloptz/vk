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
            <AppAiTextEditor />
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
            <div class="row_sm">
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
                <div class="datetime-wrapper">
                    <input
                        ref="datetimeInput"
                        v-model="date"
                        type="datetime-local"
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
            <AppGoodButton :text="'СОЗДАТЬ'" class="new_send_btn" @click="createNewStep"/>
            <AppBadButton :text="'НАЗАД'" class="new_send_btn" @click="backup"/>
        </div>
    </div>
</template>

<script>
    import AppGoodButton from '@/components/AppGoodButton.vue';
    import AppBadButton from '@/components/AppBadButton.vue';
    import AppAiTextEditor from '@/components/AppAiTextEditor.vue';

    export default {
        components: { AppGoodButton, AppBadButton, AppAiTextEditor },
        props: {
            isFirstStep: Boolean,
            editData: Object
        },
        data() {
            return {
                isDropdownVisible: false,
                type: null,
                types: ["Немедленно", "Минута", "Час", "День", "В точное время", "В точное время на следующий день", "В точную дату", "По дням недели"],
                activeIndex: -1,
                isDragging: false,
                previews: [],
                name: '',
                title: '',
                text: '',
                amountOfTime: 1,
                timeRanges: ['минута', 'час', 'день', 'месяц', ],
                activeIndexTimeRange: 0,
                timeRange: 'минута',
                isTimeRangeVisible: false
            }
        },
        watch: {
            editData: {
                handler(val) {
                if (val) {
                    this.name = val.name;
                    this.title = val.title;
                    this.text = val.text;
                    this.previews = [];
                    if (val.image) this.previews.push(val.image);
                }
                },
                immediate: true,
            }
        },
        methods: {
            backup() {
                this.$emit('backup');
            },
            createNewStep() {
                this.$emit('create_new_step');
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
    .amountOfTime {
        width: 80px !important;
    }
    .preview_btn {
        width: 150px;
        height: 51px;
    }
    .preview_btns {
        display: flex;
        flex-direction: column;
        row-gap: 30px;
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
    }

    .datetime {
        padding-left: 60px; /* чтобы не перекрылась иконкой */
        color: white;
        background: transparent;
        border: 1px solid white;
        font-size: 18px;
        border-radius: 10px;
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
    }

    .custum-file-upload input {
        display: none;
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
    .row_sm {
        display: flex;
        column-gap: 20px;
    }
    .row span {
        font-size: 18px;
        color: white;
        font-family: 'OpenSans';
    }
    .row {
        display: grid;
        grid-template-columns: 155px 1fr;
        margin-top: 30px;
        align-items: center;
        column-gap: 30px;
    }
    h2 {
        font-size: 24px;
        color: white;
        font-family: 'OpenSans';
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
            font-size: 16px;
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