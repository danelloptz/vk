<template>
    <AppAiManagerConfirmModal 
        :message="msg" 
        :isOptions="false"
        :visibility1="isConfirmModal"
        @update:visibility1="isConfirmModal = $event"
    />
    <section class="dialogs">
        <div class="search">
            <input class="search_field" v-model="search" placeholder="Поиск" />
            <AppGoodButton :text="'ПОИСК'" class="search_btn" @click="searchUser" />
            <div class="filtered_users" v-if="search != ''">
                <div 
                    v-for="(man, index) in searchUser"
                    :key="index"
                    class="filtered_user"
                    @click="setActiveMan(man.telegram_id)"
                >
                    <img :src="man.avatar" />
                    <div class="col">
                        <span>{{ man.full_name }}</span>
                        <span class="mute_2">@{{ man.username }}</span>
                    </div>
                    
                </div>
            </div>
        </div>
        <div class="noLeader_field" v-if="!isLeader">
            <span>Для просмотра истории переписки повысьте тариф до уровня Leader</span>
        </div>
        <div class="dialog">
            <div class="dialog_people">
                <div 
                    v-for="(item, index) in people"
                    :key="index"
                    class="dialog_people_item"
                    @click="setActiveMan(item.telegram_id)"
                >
                    <img :src="item.avatar" />
                    <div class="dialog_people_item_col">
                        <h2>{{ item.full_name }}</h2>
                        <span class="dialog_people_item_message">{{ item.last_message_text.slice(0, 16) + '...' }}</span>
                        <span class="dialog_people_item_count">{{ item.total_messages }}</span>
                    </div>
                    <span class="dialog_people_item_date">{{ formatedDate(+item.last_message_ts * 1000) }}</span>
                </div>
            </div>
            <div class="dialog_field" v-if="activeMan">
                <div class="dialog_field_header">
                    <img :src="activeMan.avatar" />
                    <div class="dialog_field_header_col">
                        <h2>{{ activeMan.full_name }}</h2>
                        <span>@{{ activeMan?.username }}</span>
                    </div>
                </div>
                <div class="dialog_field_messages">
                    <div 
                        v-for="(msg, index) in messages"
                        :key="index"
                        class="dialog_field_message"
                    >
                        <div class="dialog_field_message_header">
                            <img :src="msg.author == 'user' ? activeMan.avatar : msg.author == 'client' ? userData.avatar_url : require('@/assets/images/intelektaz_logo.png')" />
                            <span>{{ msg.author == 'user' ? activeMan.full_name : msg.author == 'client' ? userData.name : 'Intelektaz Bot' }}</span>
                            <span class="dialog_field_message_header_date">{{ formatedDate(+msg.date * 1000) }}</span>
                        </div>
                        <div 
                            v-if="msg?.files && msg?.files.filter(t => t.type == 'img').length > 0"
                            class="dialog_field_message_imgs"
                            :style="{ gridTemplateColumns: `repeat(${Math.min(msg.files.filter(t => t.type == 'img').length, 3)}, 1fr)` }"
                        >
                            <img 
                                v-for="(img, img_index) in msg.files.filter(t => t.type == 'img')"
                                :key="img_index"
                                class="dialog_field_message_img"
                                :src="img.src"
                                @click="downloadImage(img.src)"
                            />
                        </div>
                        <div 
                            v-if="msg?.files && msg?.files.filter(t => t.type == 'other').length > 0"
                            class="dialog_field_message_files"
                        >
                            <div 
                                v-for="(file, file_index) in msg.files.filter(t => t.type == 'other')"
                                :key="file_index"
                                class="dialog_field_message_file"
                            >
                                <img src="@/assets/images/upload.png" class="file_icon" />
                                <span>{{ file.name }}</span>
                            </div>
                        </div>
                        <span class="dialog_field_message_text" v-html="msg.text"></span>
                    </div>
                </div>
                <div class="dialog_field_footer">
                    <div class="dialog_field_footer_previews" v-if="previews.length > 0">
                        <div 
                            v-for="(preview, index) in previews"
                            :key="index"
                            class="dialog_field_footer_preview"
                            @click="deletePreview(index)"
                        >
                            <img 
                                src="@/assets/images/close.png"
                                class="dialog_field_footer_preview_close"
                            />
                            <img 
                                class="dialog_field_footer_preview_img"
                                :src="preview"
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
                        </div>
                    </div>
                    <div class="dialog_field_footer_controls">
                        <img src="@/assets/images/upload_image.png" class="upload_image" @click="uploadFiles"/>
                        <input
                            id="file"
                            type="file"
                            accept="image/*,text/*,.pdf,.doc,.docx,video/*,.mp4,.avi,.mov,.mkv,.webm"
                            @change="onFileChange"
                            ref="fileInput"
                            hidden
                            multiple
                            />
                        <textarea 
                            class="dialog_field_footer_textarea"  
                            v-model="currentMsg" 
                            placeholder="Отправить сообщение"
                            @keydown="handleKeyDown"
                        ></textarea>
                        <AppGoodButton :text="'ОТПРАВИТЬ'" class="send_message" @click="sendMessage" />
                    </div>
                </div>
            </div>
            <div class="dialog_info" v-if="activeMan">
                <div class="dialog_info_item" style="align-self: center; align-items: center;">
                    <img :src="activeMan.avatar" class="dialog_info_item_img"/>
                    <h2>{{ activeMan.full_name }}</h2>
                </div>
                <div class="dialog_info_item">
                    <span class="mute">ID</span>
                    <span>{{ activeMan.telegram_id }}</span>
                </div>
                <div class="dialog_info_item">
                    <span class="mute">Телефон</span>
                    <span>{{ activeMan?.phone && activeMan?.phone != "" ? activeMan.phone : '-' }}</span>
                </div>
                <div class="dialog_info_item">
                    <span class="mute">Username</span>
                    <span>{{ activeMan?.username }}</span>
                </div>
                <div class="dialog_info_item">
                    <span class="mute">Статус</span>
                    <span>{{ activeMan?.status }}</span>
                </div>
                <div class="dialog_info_item">
                    <span class="mute">Первое сообщение</span>
                    <span>{{ activeMan?.first_message_text }}</span>
                </div>
                <div class="dialog_info_item">
                    <span class="mute">Первая активность</span>
                    <span>{{ formatedFullDate(+activeMan?.first_message_ts * 1000) }}</span>
                </div>
                <div class="dialog_info_item">
                    <span class="mute">Последняя активность</span>
                    <span>{{ formatedFullDate(+activeMan.last_message_ts * 1000) }}</span>
                </div>
                <div class="dialog_info_item" v-if="activeMan.tags">
                    <span class="mute">Теги</span>
                    <span
                        v-for="(item, index) in activeMan.tags"
                        :key="index"
                        class="dialog_info_item_tag"
                    >
                        {{ item }}
                        <img src="@/assets/images/close.png" class="delete_tag" @click="deleteTag(index, item)"/>
                    </span>
                    <AppBadButton :text="'+ ДОБАВИТЬ'" class="add_tag_btn" @click="openNewTags" />
                    <div class="dropdown_tags" v-if="isNewTags">
                        <div 
                            v-for="(tag, tag_index) in userTags.filter(tag => !activeMan.tags.includes(tag))"
                            :key="tag_index"
                            class="dropdown_tag"
                            @click="addTag(tag)"
                        >
                            {{ tag }}
                        </div>
                    </div>
                    <AppGoodButton :text="'СОХРАНИТЬ'" v-if="tagBuffer.length > 0" @click="saveTags" class="save_tags" />
                </div>
            </div>
        </div>
    </section>
</template>


<script>
    import AppGoodButton from '@/components/AppGoodButton.vue';
    import AppBadButton from '@/components/AppBadButton.vue';
    import { 
        getAllDialogs,
        getDialog,
        changeDialog,
        changeUser
    } from '@/services/manager';
    import AppAiManagerConfirmModal from '@/components/AppAiManagerConfirmModal.vue';
    import { loadImage } from '@/services/other';

    export default {
        components: { AppGoodButton, AppBadButton, AppAiManagerConfirmModal },
        props: {
            bot_id: String,
            userTags: Array,
            isLeader: Boolean,
            userData: Object
        },
        data() {
            return {
                people: null,
                messages: null,
                activeMan: null,
                isNewTags: false,
                files_to_send: [],
                tagBuffer: [],
                previews: [],
                file_previews: [],
                currentMsg: "",
                msg: "",
                isConfirmModal: false,
                search: ""
            }
        },
        unmounted() {
            this.close();
        },
        async created() {
            const user_dialogs = await getAllDialogs(this.bot_id);
            this.people = user_dialogs;
            document.addEventListener('click', this.handleClickOutside);
        },
        computed: {
            searchUser() {
                const new_people = this.people.filter(man => man.username.toLowerCase().includes(this.search) || man.full_name.toLowerCase().includes(this.search));
                console.log(new_people);
                return new_people;
            },
        },
        methods: {
            async handleKeyDown(event) {
                if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    await this.sendMessage();
                }

                if (event.key === "Enter" && event.shiftKey) {
                    event.preventDefault();
                    this.currentMsg += "\n";
                }
            },
            close() {
                if (this.soket_dialog) {
                    this.soket_dialog.close();
                }
                if (this.soket_users) {
                    this.soket_users.close();
                }
            },
            async sendMessage() {
                if (this.currentMsg.trim() === '') return;

                let files = [];

                // ждём загрузку всех картинок
                for (const link of this.files_to_send) {
                    const image = await loadImage(link);
                    files.push({
                        type: "img",
                        src: image.image_id
                    });
                }

                // добавляем другие файлы
                for (const file of this.file_previews) {
                    files.push({
                        type: "other",
                        name: file.name,
                        src: file.url
                    });
                }

                console.log('ПЕРЕД ОТПРАВКОЙ', files);

                const message = {
                    author: 'client',
                    files: files,
                    text: this.currentMsg,
                    date: Date.now() / 1000,
                };

                if (this.activeMan.bot_active) {
                    await changeDialog(this.activeMan.dialog_id, { bot_active: false, time: 15 });
                }

                this.soket_dialog.send(JSON.stringify(message));

                this.currentMsg = '';
                this.file_previews = [];
                this.previews = [];
                this.files_to_send = [];
                this.scrollToBottom();
            },

            connectWebSocket() {
                const wsDialogUrl = `wss://web.intelektaz.com/manager-api/ws/dialog/${this.activeMan.telegram_id}_${this.bot_id}`;
                const wsUsersUl = `wss://web.intelektaz.com/manager-api/ws/dialogs_list/${this.bot_id}`;

                this.soket_dialog = new WebSocket(wsDialogUrl);
                this.soket_users = new WebSocket(wsUsersUl);

                this.soket_dialog.onopen = () => {
                    console.log('Сокент на диалоги открыт');
                };

                this.soket_dialog.onmessage = (event) => {
                    const message = JSON.parse(event.data).payload;
                    console.log(event.data.payload);
                    this.messages.push(message);
                    this.scrollToBottom();
                };

                this.soket_dialog.onerror = (error) => {
                    console.error('Ошибка на сокете диалогов:', error);
                };

                this.soket_dialog.onclose = () => {
                    console.log('Соединение с сокетом на диалоги закрыто. ');
                };

                this.soket_users.onopen = () => {
                    console.log('Сокет на информацию о пользователях открыт. ');
                };

                this.soket_users.onmessage = (event) => {
                    console.log(event);
                    const data = JSON.parse(event.data);
                    if (!data.payload) return;
                    const index = this.people.findIndex(x => x.telegram_id == data.payload.telegram_id);
                    console.log(index, this.people);
                    this.people.splice(index, 1);
                    this.people.unshift(data.payload);
                };

                this.soket_users.onerror = (error) => {
                    console.error('Ошибка на сокете информации пользователей', error);
                };

                this.soket_users.onclose = () => {
                    console.log('Соединение с сокетом информации о пользователях закрыто. ');
                };
            },
            async setActiveMan(telegram_id) {
                this.search = "";
                this.close();
                this.activeMan = this.people.find(man => man.telegram_id == telegram_id);
                if (this.isLeader) {
                    const resp = await getDialog(this.bot_id, this.activeMan.dialog_id, this.activeMan.telegram_id);
                    if (resp) {
                        this.messages = resp;
                    }
                } else {
                    this.messages = [];
                }
                
                this.connectWebSocket();
                this.scrollToBottom();
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
            deleteFilePreview(index) {
                this.file_previews.splice(index, 1);
            },
            deletePreview(index) {
                this.previews.splice(index, 1);
            },
            uploadFiles() {
                this.$refs.fileInput.click();
            },
            onFileChange(event) {
                console.log(event);
                const files = Array.from(event.target.files);

                this.previews = [];
                this.file_previews = [];

                files.forEach(file => {
                    if (file.type.startsWith('image/')) {
                        if (file.size > 300 * 1024 ) {
                            this.msg = "Размер загружаемого файла не должен превышать 300КБ!";
                            this.isConfirmModal = true;
                            return;
                        }
                        this.files_to_send.push(file);
                        const reader = new FileReader();
                        reader.onload = e => {
                            this.previews.push(e.target.result);
                        };
                        reader.readAsDataURL(file);
                    } else {
                        const fileUrl = URL.createObjectURL(file);
                        this.file_previews.push({
                            name: file.name,
                            size: file.size,
                            url: fileUrl,
                        });
                        console.log(this.file_previews);
                    }
                });
                this.$refs.fileInput.value = '';
            },
            scrollToBottom() {
                this.$nextTick(() => {
                    const messagesContainer = document.querySelector('.dialog_field_messages');
                    if (messagesContainer) {
                        messagesContainer.scrollTop = messagesContainer.scrollHeight;
                    }
                });
            },
            downloadImage(src) {
                const link = document.createElement('a');
                link.href = src;
                link.download = `download_file.jpg`;
                link.click();
            },
            handleClickOutside(event) {
                const clickedEl = event.target;
                if (!clickedEl.closest('.dropdown_tags') && !clickedEl.closest('.add_tag_btn') && this.isNewTags != -1) {
                    this.closeNewTags();
                }
            },
            async saveTags() {
                const resp = await changeUser(this.activeMan.telegram_id, {"tags": this.tagBuffer});
                if (resp) {
                    this.tagBuffer = [];
                    this.closeNewTags();
                }
            },
            openNewTags() {
                this.isNewTags = true;
            },
            closeNewTags() {
                this.isNewTags = false;
            },
            addTag(tag) {
                this.activeMan.tags.push(tag);

                if (this.tagBuffer.indexOf(tag) == -1) this.tagBuffer.push(tag)
                else this.tagBuffer = this.tagBuffer.filter(t => t != tag);

                this.closeNewTags();
            },
            deleteTag(index, tag) {
                this.activeMan.tags.splice(index, 1);

                if (this.tagBuffer.indexOf(tag) == -1) this.tagBuffer.push(tag)
                else this.tagBuffer = this.tagBuffer.filter(t => t != tag);
            },
            formatedDate(time) {
                const date = new Date(time);

                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();

                return `${day}.${month}.${year}`;
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
    .dialog_field_footer_file_preview span {
        font-size: 14px;
        color: white;
        font-family: 'OpenSans';
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
    }
    .dialog_field_footer_file_previews {
        display: flex;
        flex-direction: column;
        row-gap: 5px;
    }
    .dialog_field_footer_previews {
        display: flex;
        flex-wrap: wrap;
        column-gap: 5px;
        row-gap: 5px;
    }
    .dialog_field_footer_preview {
        width: 60px;
        height: 60px;
        position: relative;
    }
    .dialog_field_footer_preview_img {
        width: 100%;
        height: 100%;
        object-fit: cover;
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
        width: 20px;
        height: 20px;
        position: absolute;
        top: 20px; 
        left: 20px;
        opacity: 0;
        cursor: pointer;
        transition: opacity 0.2s ease-in;
        z-index: 900;
        pointer-events: none;
    }
    .dialog_field_footer_preview:hover .dialog_field_footer_preview_close {
        opacity: 1;
    }
    .dialog_field_footer {
        display: flex;
        flex-direction: column;
        row-gap: 10px;
        padding: 10px;
    }
    .dialog_field_message_text {
        font-size: 14px;
        color: white;
        font-family: 'OpenSans';
    }
    .dialog_field_message_file span {
        font-size: 14px;
        color: white;
        font-family: 'OpenSans';
    }
    .dialog_field_message_file img {
        width: 20px;
        height: 20px;
    }
    .dialog_field_message_file {
        display: flex;
        column-gap: 10px;
        align-items: center;
        border: 1px solid rgba(255, 255, 255, 0.5);
        padding: 10px;
        border-radius: 5px;
        cursor: pointer;
    }
    .dialog_field_message_files {
        display: flex;
        flex-direction: column;
        width: 100%;
        row-gap: 10px;
    }
    .dialog_field_message_imgs img:hover {
        filter: brightness(1.2);
    }
    .dialog_field_message_imgs img {
        width: 100%;
        max-height: 200px;
        object-fit: cover;
        object-position: center;
        cursor: pointer;
        transition: .1s ease-in;
    }
    .dialog_field_message_imgs {
        display: grid;
        width: 100%;
    }
    .dialog_field_message_header_date {
        position: absolute;
        right: 10px;
        top: 15px;
        color: rgba(255, 255, 255, 0.5) !important;
        font-size: 10px !important;
    }
    .dialog_field_message_header span {
        font-size: 14px;
        color: white;
        font-family: 'OpenSans';
    }
    .dialog_field_message_header img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
    }
    .dialog_field_message_header {
        display: flex;
        column-gap: 20px;
        align-items: center;
        position: relative;
    }
    .dialog_field_message {
        display: flex;
        flex-direction: column;
        row-gap: 20px;
        width: 100%;
        padding: 0px 10px;
        /* background: #111433; */
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
    .delete_tag {
        width: 10px;
        height: 10px;
        cursor: pointer;
    }
    .dialog_info_item_tag {
        background: #111433;
        padding: 4px 10px;
        border-radius: 5px;
        font-size: 16px;
        font-family: 'OpenSans';
        color: white;
        display: flex;
        align-items: center;
        column-gap: 10px;
        width: fit-content;
    }
    .add_tag_btn {
        width: 95px;
        height: 32px;
        font-size: 9.98px;
        letter-spacing: 0px;
    }
    .add_field_btn, .save_tags {
        width: 130px;
        height: 32px;
        font-size: 9.98px;
        letter-spacing: 0px;
    }
    .mute {
        color: rgba(255, 255, 255, 0.5) !important;
    }
    .mute_2 {
        color: rgba(255, 255, 255, 0.5) !important;
        font-size: 14px !important;
    }
    .dialog_info_item h2, .dialog_info_item span {
        font-size: 14px;
        color: white;
        font-family: 'OpenSans';
    }
    .dialog_info_item_img {
        width: 80px;
        height: 80px;
        border-radius: 50%;
    }
    .dialog_info_item {
        display: flex;
        flex-direction: column;
        row-gap: 6px;
        position: relative;
    }
    .dialog_info {
        width: 100%;
        display: flex;
        flex-direction: column;
        row-gap: 20px;
        padding: 20px 25px;

    }
    .dialog_field_header_col span {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.5);
        font-family: 'OpenSans';
    }
    .dialog_field_header_col h2 {
        font-size: 14px;
        color: white;
        font-family: 'OpenSans';
    }
    .dialog_field_header_col {
        display: flex;
        flex-direction: column;
    }
    .dialog_field_header img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
    }
    .dialog_field_header {
        padding: 20px;
        display: flex;
        column-gap: 20px;
        align-items: center;
    }
    .dialog_field {
        width: 100%;
        display: flex;
        flex-direction: column;
        border-right: 1px solid rgba(255, 255, 255, 0.5);
    }
    .send_message {
        width: 90px;
        height: 29px;
        font-size: 10px;
        letter-spacing: 0px;
        border-radius: 5px;
    }
    .dialog_field_footer_textarea {
        min-height: 70px;
        max-height: 200px;
        width: 100%;
        background: none;
        border: none;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.5);
        font-family: 'OpenSans';
        margin-top: -5px;
        padding: 10px;
    }
    .upload_image {
        width: 22px;
        cursor: pointer;
    }
    .dialog_field_footer_controls {
        display: grid;
        grid-template-columns: 20px 1fr 90px;
        padding: 15px 20px;
        padding-bottom: 0px;
        column-gap: 10px;
        border-top: 1px solid rgba(255, 255, 255, 0.5);
    }
    .dialog_field_messages {
        height: 864px; /* 86 80 */
        border-top: 1px solid rgba(255, 255, 255, 0.5);
        padding: 30px 10px;
        display: flex;
        flex-direction: column;
        /* justify-content: end; */
        row-gap: 20px;
        overflow-y: auto;
    }
    .dialog_people_item_date {
        position: absolute;
        top: 5px;
        right: 0px;
        font-size: 10px;
        font-family: 'OpenSans';
        color: rgba(255, 255, 255, 0.5);
    }
    .dialog_people_item_count {
        color: white;
        font-size: 8px;
        font-family: 'OpenSans';
        border-radius: 10px;
        padding: 1px 5px;
        background: #1CA2EA;
        margin-top: 10px;
        width: fit-content;
    }
    .dialog_people_item_message {
        color: rgba(255, 255, 255, 0.5);
        font-family: 'OpenSans';
        font-size: 12px;
    }
    .dialog_people_item_col h2 {
        font-size: 14px;
        color: white;
        font-family: 'OpenSans';
        font-weight: bold;
        max-width: 70px;
    }
    .dialog_people_item_col {
        display: flex;
        flex-direction: column;
    }
    .dialog_people_item img {
        width: 60px;
        height: 60px;
        border-radius: 50%;
    }
    .dialog_people_item:hover {
        background: #111433;
    }
    .active_man {
        background: #111433;
    }
    .dialog_people_item {
        position: relative;
        width: 100%;
        display: flex;
        column-gap: 10px;
        align-items: center;
        cursor: pointer;
        transition: .1s ease-in;
        padding: 10px;
    }
    .dialog_people {
        border-right: 1px solid rgba(255, 255, 255, 0.5);
        padding: 20px 15px;
        display: flex;
        flex-direction: column;
        row-gap: 20px;
    }
    .dialog {
        display: grid;
        grid-template-columns: 230px 1fr 230px;
        width: 100%;
        border: 1px solid rgba(255, 255, 255, 0.5);
        margin-top: 38px;
        min-height: 1050px;
    }
    .search_btn {
        width: 150px;
        height: 40px;
        font-size: 16px;
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
    }
    .dialogs {
        width: 100%;
        display: flex;
        flex-direction: column;
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
    .noLeader_field {
        padding: 17px 20px;
        background: #BC2929;
        width: 100%;
        margin-top: 30px;
    }
    .noLeader_field span {
        font-size: 18px;
        color: white;
        font-family: 'OpenSans';
    }
</style>