<template>
    <section class="dialogs">
        <div class="search">
            <input class="search_field" v-model="search" placeholder="Поиск" />
            <AppGoodButton :text="'ПОИСК'" class="search_btn" />
        </div>
        <div class="dialog">
            <div class="dialog_people">
                <div 
                    v-for="(item, index) in people"
                    :key="index"
                    class="dialog_people_item"
                    :class="{ active_man: item.telegram_id == activeMan?.telegram_id }"
                    @click="setActiveMan(index)"
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
                            <img :src="msg.author == 'user' ? activeMan.avatar : require('@/assets/images/intelektaz_logo.png')" />
                            <span>{{ msg.author == 'user' ? activeMan.full_name : 'Intelektaz Bot' }}</span>
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
                        <span class="dialog_field_message_text">{{ msg.text }}</span>
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
                            accept="image/*,text/*,.pdf,.doc,.docx"
                            @change="onFileChange"
                            ref="fileInput"
                            hidden
                            multiple
                        />
                        <textarea class="dialog_field_footer_textarea" v-model="currentMsg" placeholder="Отправить сообщение"></textarea>
                        <img src="@/assets/images/send_message.png" class="send_message" @click="sendMessage" />
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
                    <span>{{ activeMan?.phone != "" ? activeMan.phone : '-' }}</span>
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
                    <span>{{ activeMan?.first_msg }}</span>
                </div>
                <div class="dialog_info_item">
                    <span class="mute">Первая активность</span>
                    <span>{{ formatedFullDate(activeMan?.fisrt_active) }}</span>
                </div>
                <div class="dialog_info_item">
                    <span class="mute">Последняя активность</span>
                    <span>{{ formatedFullDate(+activeMan.last_message_ts * 1000) }}</span>
                </div>
                <AppBadButton :text="'+ ДОБАВИТЬ ПОЛЕ'" class="add_field_btn" />
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
                            v-for="(tag, tag_index) in activeMan?.userTags.filter(tag => !activeMan.tags.includes(tag))"
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
        getDialog 
    } from '@/services/manager';

    export default {
        components: { AppGoodButton, AppBadButton },
        props: {
            bot_id: String
        },
        data() {
            return {
                people: null,
                // activeMan: {
                //     name: "Иванов Иван",
                //     img: "https://sun6-22.vkuserphoto.ru/s/v1/ig2/LgVFW7BY5QJDAfIMu6FxBZ65WkxQIPs9-YVYQVGqdims6hVhlyD1HjUqSQFvUYDSXpid2Rgxm-PQLsAzYIlH2yiP.jpg?quality=95&crop=192,130,768,768&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720&ava=1&cs=200x200",
                //     count: 1482,
                //     username: "ivanovivan",
                //     id: 42423591,
                //     phone: "",
                //     status: "Активный",
                //     first_msg: "/start",
                //     fisrt_active: 1753787205862, 
                //     last_active: 1755095394934,
                //     tags: ["Работа"],
                //     userTags: ["Книги", "Спорт", "Работа", "Продвижение", "Искусство"],
                //     messages: [
                //         {
                //             author: "user",
                //             date: 1755095394934,
                //             files: [
                //                 {
                //                     type: "img",
                //                     src: "https://sun6-22.vkuserphoto.ru/s/v1/ig2/LgVFW7BY5QJDAfIMu6FxBZ65WkxQIPs9-YVYQVGqdims6hVhlyD1HjUqSQFvUYDSXpid2Rgxm-PQLsAzYIlH2yiP.jpg?quality=95&crop=192,130,768,768&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720&ava=1&cs=200x200"
                //                 },
                //                 {
                //                     type: "img",
                //                     src: "https://sun6-21.vkuserphoto.ru/s/v1/ig2/FAt8r8EAkWLeRrtk0S2TimvC0eigIrH08jSRjF0VccX1b-PHw9QdRO-3RQGvlVWdY0ZXfCy5bR8HtS0bRkvf1DbG.jpg?quality=95&crop=339,132,1065,1065&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720&ava=1&cs=240x240"
                //                 },
                //                 {
                //                     type: "img",
                //                     src: "https://sun6-22.vkuserphoto.ru/s/v1/ig2/LgVFW7BY5QJDAfIMu6FxBZ65WkxQIPs9-YVYQVGqdims6hVhlyD1HjUqSQFvUYDSXpid2Rgxm-PQLsAzYIlH2yiP.jpg?quality=95&crop=192,130,768,768&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720&ava=1&cs=200x200"
                //                 },
                //                 {
                //                     type: "img",
                //                     src: "https://sun6-21.vkuserphoto.ru/s/v1/ig2/FAt8r8EAkWLeRrtk0S2TimvC0eigIrH08jSRjF0VccX1b-PHw9QdRO-3RQGvlVWdY0ZXfCy5bR8HtS0bRkvf1DbG.jpg?quality=95&crop=339,132,1065,1065&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720&ava=1&cs=240x240"
                //                 },
                //                 {
                //                     type: "other",
                //                     name: "ЦЕНТРАЛЬНЫЕ ПРОЦЕССОРЫ ПЕРСОНАЛЬНЫХ ЭВМ",
                //                     src: "https://edu.petrsu.ru/files/upload/2124_1427288068.pdf"
                //                 },
                //                 {
                //                     type: "other",
                //                     name: "ЦЕНТРАЛЬНЫЕ ПРОЦЕССОРЫ ПЕРСОНАЛЬНЫХ ЭВМ",
                //                     src: "https://edu.petrsu.ru/files/upload/2124_1427288068.pdf"
                //                 },
                //             ],
                //             text: "Текст сообщения. Текст сообщения. Текст сообщения. Текст сообщения. Текст сообщения. Текст сообщения. Текст сообщения. Текст сообщения. Текст сообщения. Текст сообщения."
                //         },
                //         {
                //             author: "bot",
                //             date: 1755095394934,
                //             files: [
                //                 {
                //                     type: "none",
                //                     src: ""
                //                 },
                //             ],
                //             text: "Ответ бота. Ответ бота. Ответ бота. Ответ бота. Ответ бота. Ответ бота. Ответ бота. Ответ бота. Ответ бота. Ответ бота. Ответ бота. Ответ бота. Ответ бота. "
                //         },
                //         {
                //             author: "user",
                //             date: 1755095394934,
                //             files: [
                //                 {
                //                     type: "img",
                //                     src: "https://sun6-22.vkuserphoto.ru/s/v1/ig2/LgVFW7BY5QJDAfIMu6FxBZ65WkxQIPs9-YVYQVGqdims6hVhlyD1HjUqSQFvUYDSXpid2Rgxm-PQLsAzYIlH2yiP.jpg?quality=95&crop=192,130,768,768&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720&ava=1&cs=200x200"
                //                 },
                //                 {
                //                     type: "img",
                //                     src: "https://sun6-21.vkuserphoto.ru/s/v1/ig2/FAt8r8EAkWLeRrtk0S2TimvC0eigIrH08jSRjF0VccX1b-PHw9QdRO-3RQGvlVWdY0ZXfCy5bR8HtS0bRkvf1DbG.jpg?quality=95&crop=339,132,1065,1065&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720&ava=1&cs=240x240"
                //                 },
                //                 {
                //                     type: "other",
                //                     name: "ЦЕНТРАЛЬНЫЕ ПРОЦЕССОРЫ ПЕРСОНАЛЬНЫХ ЭВМ",
                //                     src: "https://edu.petrsu.ru/files/upload/2124_1427288068.pdf"
                //                 },
                //                 {
                //                     type: "other",
                //                     name: "ЦЕНТРАЛЬНЫЕ ПРОЦЕССОРЫ ПЕРСОНАЛЬНЫХ ЭВМ",
                //                     src: "https://edu.petrsu.ru/files/upload/2124_1427288068.pdf"
                //                 },
                //             ],
                //             text: "Текст сообщения. Текст сообщения. Текст сообщения. Текст сообщения. Текст сообщения. Текст сообщения. Текст сообщения. Текст сообщения. Текст сообщения. Текст сообщения."
                //         },
                //         {
                //             author: "bot",
                //             date: 1755095394934,
                //             files: [
                //                 {
                //                     type: "none",
                //                     src: ""
                //                 },
                //             ],
                //             text: "Ответ бота. Ответ бота. Ответ бота. Ответ бота. Ответ бота. Ответ бота. Ответ бота. Ответ бота. Ответ бота. Ответ бота. Ответ бота. Ответ бота. Ответ бота. "
                //         },
                //     ]
                // },
                messages: null,
                activeMan: null,
                isNewTags: false,
                tagBuffer: [],
                previews: [],
                file_previews: [],
                currentMsg: ""
            }
        },
        unmounted() { // Для Vue 3
            this.close();
        },
        async created() {
            const user_dialogs = await getAllDialogs(this.bot_id);
            this.people = user_dialogs;
            // {
            //     name: "Иванов Иван",
            //     img: "https://sun6-22.vkuserphoto.ru/s/v1/ig2/LgVFW7BY5QJDAfIMu6FxBZ65WkxQIPs9-YVYQVGqdims6hVhlyD1HjUqSQFvUYDSXpid2Rgxm-PQLsAzYIlH2yiP.jpg?quality=95&crop=192,130,768,768&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720&ava=1&cs=200x200",
            //     date: 1753787205862,
            //     message: "Тут какое-то последнее сообщение",
            //     count: 1482,
            //     id: 42423591,
            // },

            document.addEventListener('click', this.handleClickOutside);
            this.scrollToBottom();
        },
        methods: {
            close() {
                if (this.socket) {
                    this.socket.close(); // Close WebSocket connection when leaving
                }
            },
            sendMessage() {
                if (this.currentMsg.trim() === '') return;

                // Prepare message object
                const message = {
                    author: 'client',
                    files: this.file_previews,
                    text: this.currentMsg,
                    date: Date.now() / 1000,
                };

                // Send message via WebSocket
                this.socket.send(JSON.stringify(message));

                // Add sent message to the list
                this.messages.push(message);

                // Clear input field
                this.currentMsg = '';

                // Scroll to the bottom of the messages container
                this.scrollToBottom();
            },
            connectWebSocket() {
                // Construct WebSocket URL
                const wsUrl = `wss://web.intelektaz.com/manager-api/ws/dialog/${this.activeMan.telegram_id}_${this.bot_id}`;

                // Initialize WebSocket connection
                this.socket = new WebSocket(wsUrl);

                // WebSocket event listeners
                this.socket.onopen = () => {
                    console.log('WebSocket connection established.');
                };

                this.socket.onmessage = (event) => {
                    const message = JSON.parse(event.data.payload);
                    console.log(event.data.payload);
                    this.messages.push(message); // Add received message to the list
                    this.scrollToBottom(); // Scroll to the bottom of the messages container
                };

                this.socket.onerror = (error) => {
                    console.error('WebSocket error:', error);
                };

                this.socket.onclose = () => {
                    console.log('WebSocket connection closed.');
                };
            },
            async setActiveMan(index) {
                this.close();
                this.activeMan = this.people[index]
                const resp = await getDialog(this.bot_id, this.activeMan.dialog_id, this.activeMan.telegram_id);
                if (resp) {
                    this.messages = resp;
                }
                this.connectWebSocket();
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
                const files = Array.from(event.target.files);

                this.previews = [];
                this.file_previews = [];

                files.forEach(file => {
                    if (file.type.startsWith('image/')) {
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
            },
            scrollToBottom() {
                this.$nextTick(() => {
                    const messagesContainer = this.$el.querySelector('.messages');
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
            saveTags() {
                this.tagBuffer = [];
                this.closeNewTags();
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
        padding: 20px 15px;
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
        width: 15px;
        height: 15px;
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
        width: 20px;
        height: 20px;
        cursor: pointer;
    }
    .dialog_field_footer_controls {
        display: grid;
        grid-template-columns: 20px 1fr 15px;
        padding: 15px 20px;
        column-gap: 10px;
        border-top: 1px solid rgba(255, 255, 255, 0.5);
    }
    .dialog_field_messages {
        height: 700px;
        border-top: 1px solid rgba(255, 255, 255, 0.5);
        padding: 30px 10px;
        display: flex;
        flex-direction: column;
        row-gap: 30px;
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
    }
    .dialogs {
        width: 100%;
        display: flex;
        flex-direction: column;
    }
</style>