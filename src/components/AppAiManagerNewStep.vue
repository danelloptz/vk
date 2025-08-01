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
            <input v-model="name" type="text" />
        </div>
        <div class="row">
            <span>Изображения</span>
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
                    <svg viewBox="0 0 24 24" fill="" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z" fill=""></path> </g></svg>
                </div>
                <div class="text">
                    <span>Click to upload image</span>
                </div>
                <input
                    id="file"
                    type="file"
                    multiple
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
        </div>
        <div class="row">
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
                            @mousedown.prevent="selectType(item)"
                            :class="{ bold: index == activeIndex }"
                        >
                            {{ item }}
                        </li>
                    </ul>
                </div>
                <input v-model="date" type="date" />
            </div>
        </div>
        <div class="new_send_footer">
            <AppGoodButton :text="'СОЗДАТЬ'" class="new_send_btn"/>
            <AppBadButton :text="'НАЗАД'" class="new_send_btn"/>
        </div>
    </div>
</template>

<script>
    import AppGoodButton from '@/components/AppGoodButton.vue';
    import AppBadButton from '@/components/AppBadButton.vue';

    export default {
        components: { AppGoodButton, AppBadButton },
        data() {
            return {
                isDropdownVisible: false,
                type: null,
                types: ["Немедленно", "Минута", "Час", "День", "В точное время", "В точное время на следующий день", "В точную дату", "По дням недели"],
                activeIndex: -1,
                isDragging: false,
                previews: [],
            }
        },
        methods: {
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
            selectType(item) {
                this.type = item;
                this.hideDropdown();
            },
        }
    };
</script>

<style scoped>
    .preview-list {
        display: flex;
        gap: 10px;
        margin-top: 10px;
        flex-wrap: wrap;
    }

    .preview-item img {
        width: 100px;
        height: 100px;
        object-fit: cover;
        border-radius: 8px;
        border: 1px solid #444;
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
    }

    .custum-file-upload .icon svg {
        height: 80px;
        fill: #e8e8e8;
    }

    .custum-file-upload .text {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .custum-file-upload .text span {
        font-weight: 400;
        color: #e8e8e8;
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
        padding: 20px;
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
        border-bottom: 1px solid white;
        font-family: 'OpenSans';
        padding: 10px 0px;
    }

    .dropdown-menu li:hover {
        background: #0c103e;
    }
</style>