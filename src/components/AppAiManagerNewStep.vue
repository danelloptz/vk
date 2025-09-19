<template>
    <AppAiManagerConfirmModal 
        :message="msg" 
        :isOptions="false"
        :visibility1="isConfirmModal"
        @update:visibility1="isConfirmModal = $event"
    />
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
            <div class="editor_col">
                <AppAiTextEditor 
                    class="editor" 
                    @count="handleSizeText"
                    @update="text = $event" 
                    :startText="text" 
                />
                <span v-if="sizeToDecrease > 0" class="red">Уменьшите текст на {{ sizeToDecrease }} символов. </span>
            </div>
            
        </div>
        <div class="row">
            <div class="sm_row">
                <img src="@/assets/images/upload_image.png" />
                <span>Прикрепить файлы</span>
            </div>
            <!-- From Uiverse.io by csemszepp --> 
            <!-- <label 
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
            </label> -->
            <div class="row_sm inputs">
                <div class="file-input">
                    <label class="file-label">
                    <img src="@/assets/images/image_icon_step.png" alt="icon" class="photo_image"/>
                    фото
                    <input 
                        class="photo_input"
                        type="file"
                        accept="image/*"
                        @change="onFileChange"
                    />
                    </label>
                </div>
                <div class="file-input">
                    <label class="file-label">
                    <img src="@/assets/images/video_icon_step.png" class="video_image" alt="icon"/>
                    видео
                    <input 
                        class="video_input"
                        type="file"
                        accept="video/*"
                        @change="onFileChange"
                    />
                    </label>
                </div>
                <div class="file-input">
                    <label class="file-label">
                    <img src="@/assets/images/file_icon_step.png" style="filter: invert(1) brightness(2);" class="photo_image" alt="icon"/>
                    файл
                    <input 
                        class="video_input"
                        type="file"
                        accept="text/*,.pdf,.doc,.docx,.txt,.rtf,.xlsx,.pptx,.zip,.rar,"
                        @change="onFileChange"
                    />
                    </label>
                </div>
                <div class="file-input">
                    <label class="file-label">
                    <img src="@/assets/images/video_icon_step.png" class="video_image" alt="icon"/>
                    видеосообщение
                    <input 
                        class="vide_msg_input"
                        type="file"
                        accept="video/*"
                        @change="onFileChange"
                    />
                    </label>
                </div>
                <div class="file-input">
                    <label class="file-label">
                    <img src="@/assets/images/mic_icon_step.png" class="mic_image" alt="icon"/>
                    аудио
                    <input 
                        class="audio_input"
                        type="file"
                        accept="audio/*"
                        @change="onFileChange"
                    />
                    </label>
                </div>
            </div>

        </div>
        <div class="dialog_field_footer_previews" v-if="previews.length > 0">
            <div 
                v-for="(preview, index) in previews"
                :key="index"
                class="dialog_field_footer_preview"
                @click="deleteImagePreview(index)"
            >
                <img 
                    src="@/assets/images/close.png"
                    class="dialog_field_footer_preview_close"
                />
                <img 
                    class="dialog_field_footer_preview_img"
                    :src="preview.src"
                />
            </div>
        </div>
        <div class="dialog_field_footer_file_previews">
            <div 
                v-for="(file, index) in file_previews"
                :key="index"
                class="dialog_field_footer_file_preview"
                @click="deleteFilePreview(index)"
            >
                <img 
                    class="dialog_field_footer_file_preview_icon"
                    src="@/assets/images/upload.png"
                />
                <span>{{ file.name }}</span>
                <span>{{ formatFileSize(file.size) }}</span>
                <img 
                    src="@/assets/images/close.png"
                    class="dialog_field_footer_preview_close"
                />
            </div>
        </div>
        <div class="preview_btns" v-if="files_to_send.length > 0">
            <AppBadButton :text="'УДАЛИТЬ'" @click="deletePreview" class="preview_btn" />
        </div>
        <!-- <div class="preview-list" v-if="previews.length">
            <div class="preview-item" v-for="(src, index) in previews" :key="index">
                <img :src="src" alt="Preview" />
            </div>
            <div class="preview_btns">
                <AppBadButton :text="'ИЗМЕНИТЬ'" @click="deletePreview" class="preview_btn"/>
                <AppBadButton :text="'УДАЛИТЬ'" @click="deletePreview" class="preview_btn" />
            </div>
        </div> -->
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
                <input type="text" v-if="['минута', 'час', 'день'].indexOf(type) != -1" class="amountOfTime" v-model="amountOfTime" />
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
    import AppAiManagerConfirmModal from '@/components/AppAiManagerConfirmModal.vue';
    import { 
        createCampaignStep, 
        getCompaignStep,
        saveStepSettings
    } from '@/services/manager';
    import { loadImage } from '@/services/other';

    export default {
        components: { AppGoodButton, AppBadButton, AppAiTextEditor, AppAiManagerConfirmModal },
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
                file_previews: [],
                files_to_send: [],
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
                step_id: null,
                sizeToDecrease: 0,
                msg: "",
                isConfirmModal: false
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
        // created() {
        //     setTimeout(() => {
        //         const el = document.querySelector('.ck-editor');
        //         // const el2 = document.querySelector('.ck-content');
        //         if (el) el.style.width = '100%';
        //         // if (el2) {
        //         //     el2.style.height = '280px';
        //         // } 
        //     }, 1000);
            
        // },
        methods: {
            deleteFilePreview(index) {
                const id = this.file_previews[index].id;
                this.files_to_send = this.files_to_send.filter(item => item.id != id);
                this.file_previews.splice(index, 1);
            },
            deleteImagePreview(index) {
                const id = this.previews[index].id;
                this.files_to_send = this.files_to_send.filter(item => item.id != id);
                this.previews.splice(index, 1);
            },
            async readyToSend() {
                let files = [];

                // ждём загрузку всех картинок
                for (const link of this.files_to_send) {
                    const image = await loadImage(link.file);
                    files.push({
                        type: "img",
                        url: image.image_id
                    });
                }

                // добавляем другие файлы
                for (const file of this.file_previews) {
                    const link = await loadImage(file.link);
                    const type = file.type.startsWith('video/') ? 'video' : 'other';
                    files.push({
                        type: type,
                        name: file.name,
                        url: link.image_id
                    });
                }

                return files;
            },
            onFileChange(event) {
                console.log(event);
                const files = Array.from(event.target.files);
                const id = Date.now();

                // this.previews = [];
                // this.file_previews = [];

                files.forEach(file => {
                    if (file.type.startsWith('image/')) {
                        if (file.size > 300 * 1024 ) {
                            this.msg = "Размер загружаемого файла не должен превышать 300КБ!";
                            this.isConfirmModal = true;
                            return;
                        }
                        this.files_to_send.push({
                            "file": file,
                            "id": id
                        });
                        const reader = new FileReader();
                        reader.onload = e => {
                            this.previews.push({
                                src: e.target.result,
                                id: id
                            });
                        };
                        reader.readAsDataURL(file);
                    } else {
                        const fileUrl = URL.createObjectURL(file);
                        this.file_previews.push({
                            name: file.name,
                            size: file.size,
                            url: fileUrl,
                            link: file,
                            type: file.type,
                            id: id
                        });
                        console.log(this.file_previews);
                    }
                });
            },
            formatFileSize(bytes) {
                if (bytes < 1024) {
                    return `${bytes} B`;
                } else if (bytes < 1024 * 1024) {
                    return `${(bytes / 1024).toFixed(2)} KB`;
                } else if (bytes < 1024 * 1024 * 1024) {
                    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
                } else {
                    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
                }
            },
            handleSizeText(size) {
                const max_size = this.files.length > 0 ? 1020 : 4090;
                if (size > max_size) this.sizeToDecrease = size - max_size
                else this.sizeToDecrease = 0;
            },
            async saveStep() {
                 if (this.sizeToDecrease > 0) {
                    this.msg = `Уменьшите размер текста на ${this.sizeToDecrease} символов!`;
                    this.isConfirmModal = true;
                    return;
                }
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
                if (this.sizeToDecrease > 0) {
                    this.msg = `Уменьшите размер текста на ${this.sizeToDecrease} символов!`;
                    this.isConfirmModal = true;
                    return;
                }
                let send_time;
                if (this.isFirstStep) {
                    const dt = new Date(this.date);
                    send_time = {
                        "first": this.isFirstStep, 
                        "first_type": this.type,
                        "first_time": Math.ceil(dt.getTime() / 1000)
                    };
                    if (['минута', 'час', 'день'].indexOf(this.type) != -1) send_time.first_time = this.amountOfTime;
                } else {
                    send_time = {
                        "first": this.isFirstStep, 
                        "second_type": this.timeRange,
                        "second_time": this.amountOfTime
                    };
                }
                const files = await this.readyToSend();
                const resp = await createCampaignStep(this.campaignData.campaign_id, this.name, this.title, this.text, files, send_time);
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
                this.files_to_send = [];
                this.file_previews = [];
            },
            openPicker() {
                const input = this.$refs.datetimeInput;
                if (input.showPicker) {
                    input.showPicker();
                } else {
                    input.focus(); // fallback
                }
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
    .file-input {
      position: relative;
      display: inline-block;
    }

    .file-input input[type="file"] {
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0;
      width: 100%;
      height: 100%;
      cursor: pointer;
    }

    .file-label {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #181b3a;
      color: white;
      padding: 12px 20px;
      border-radius: 10px;
      font-family: sans-serif;
      font-size: 18px;
      cursor: pointer;
      transition: background 0.2s;
    }

    .file-label:hover {
      background: #232652;
    }

    .photo_image {
        width: 15px;
        height: 15px;
    }
    .video_image {
        width: 15px;
    }
    .mic_image {
        width: 8px;
    }
    /* .photo_input, .video_input, .vide_msg_input, .audio_input {

    } */
    .dialog_field_footer_file_preview span {
        font-size: 14px;
        color: white;
        font-family: 'OpenSans';
        @media (max-width: 650px) {
            word-wrap: break-word;
            word-break: break-all;
        }
    }
    .dialog_field_footer_file_preview_icon {
        width: 20px;
        height: 20px;
    }
    .dialog_field_footer_file_preview {
        display: flex;
        column-gap: 10px;
        align-items: center;
        border: 1px solid rgba(255, 255, 255, 0.5);
        padding: 10px;
        border-radius: 5px;
        cursor: pointer;
        position: relative;
    }
    .dialog_field_footer_file_previews {
        display: flex;
        flex-direction: column;
        row-gap: 5px;
        margin-top: 20px;
    }
    .dialog_field_footer_previews {
        display: flex;
        flex-wrap: wrap;
        column-gap: 5px;
        row-gap: 5px;
        margin-top: 20px;
    }
    .dialog_field_footer_preview {
        max-width: 200px;
        max-height: 100px;
        position: relative;
    }
    .dialog_field_footer_preview_img {
        width: 100%;
        max-height: 100px;
        object-fit: contain;
        object-position: center;
        border-radius: 10px;
        cursor: pointer;
        position: relative;
        transition: filter 0.2s ease-in;
        z-index: 100;
    }
    .dialog_field_footer_preview_img:hover {
        filter: brightness(0.5);
    }
    .dialog_field_footer_preview_close {
        width: 15px;
        height: 15px;
        position: absolute;
        top: 13px; 
        right: 13px;
        opacity: 1;
        cursor: pointer;
        transition: opacity 0.2s ease-in;
        z-index: 900;
        pointer-events: none;
    }
    .dialog_field_footer_preview:hover .dialog_field_footer_preview_close {
        opacity: 1;
    }
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
        column-gap: 10px;
        row-gap: 30px;
        margin-top: 10px;
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
    .inputs {
        @media (max-width: 650px) {
            flex-wrap: wrap;
            row-gap: 7px;
            column-gap: 7px;
        }
    }
    .sm_row {
        display: flex;
        column-gap: 10px;
    }
    .sm_row img {
        width: 18px;
        height: 16px;
    }
    .sm_row span {
        font-size: 18px;
        color: white;
        font-family: 'OpenSans';
        @media (max-width: 650px) {
            font-size: 14px;
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
    .editor_col {
        width: 100%;
        display: flex;
        flex-direction: column;
        row-gap: 10px;
    }
    .red {
        font-family: 'OpenSans';
        color: red !important;
        font-size: 20px;
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