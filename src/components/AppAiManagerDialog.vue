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
                >
                    <img :src="item.img" />
                    <div class="dialog_people_item_col">
                        <h2>{{ item.name }}</h2>
                        <span class="dialog_people_item_message">{{ item.message.slice(0, 21) }}</span>
                        <span class="dialog_people_item_count">{{ item.count }}</span>
                    </div>
                    <span class="dialog_people_item_date">{{ formatedDate(item.date) }}</span>
                </div>
            </div>
            <div class="dialog_field">
                <div class="dialog_field_header">
                    <img :src="activeMan.img" />
                    <div class="dialog_field_header_col">
                        <h2>{{ activeMan.name }}</h2>
                        <span>@{{ activeMan.username }}</span>
                    </div>
                </div>
                <div class="dialog_field_messages">

                </div>
                <div class="dialog_field_footer">
                    <img src="@/assets/images/upload_image.png" class="upload_image" />
                    <textarea class="dialog_field_footer_textarea" placeholder="Отправить сообщение"></textarea>
                    <img src="@/assets/images/send_message.png" class="send_message" />
                </div>
            </div>
            <div class="dialog_info">
                <div class="dialog_info_item" style="align-self: center; align-items: center;">
                    <img :src="activeMan.img" class="dialog_info_item_img"/>
                    <h2>{{ activeMan.name }}</h2>
                </div>
                <div class="dialog_info_item">
                    <span class="mute">ID</span>
                    <span>{{ activeMan.id }}</span>
                </div>
                <div class="dialog_info_item">
                    <span class="mute">Телефон</span>
                    <span>{{ activeMan.phone != "" ? activeMan.phone : '-' }}</span>
                </div>
                <div class="dialog_info_item">
                    <span class="mute">Username</span>
                    <span>{{ activeMan.username }}</span>
                </div>
                <div class="dialog_info_item">
                    <span class="mute">Статус</span>
                    <span>{{ activeMan.status }}</span>
                </div>
                <div class="dialog_info_item">
                    <span class="mute">Первое сообщение</span>
                    <span>{{ activeMan.first_msg }}</span>
                </div>
                <div class="dialog_info_item">
                    <span class="mute">Первая активность</span>
                    <span>{{ formatedFullDate(activeMan.fisrt_active) }}</span>
                </div>
                <div class="dialog_info_item">
                    <span class="mute">Последняя активность</span>
                    <span>{{ formatedFullDate(activeMan.last_active) }}</span>
                </div>
                <AppBadButton :text="'+ ДОБАВИТЬ ПОЛЕ'" class="add_field_btn" />
                <div class="dialog_info_item">
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
                            v-for="(tag, tag_index) in activeMan.userTags.filter(tag => !activeMan.tags.includes(tag))"
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
    export default {
        components: { AppGoodButton, AppBadButton },
        data() {
            return {
                people: [
                    {
                        name: "Иванов Иван",
                        img: "https://sun6-22.vkuserphoto.ru/s/v1/ig2/LgVFW7BY5QJDAfIMu6FxBZ65WkxQIPs9-YVYQVGqdims6hVhlyD1HjUqSQFvUYDSXpid2Rgxm-PQLsAzYIlH2yiP.jpg?quality=95&crop=192,130,768,768&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720&ava=1&cs=200x200",
                        date: 1753787205862,
                        message: "Тут какое-то последнее сообщение",
                        count: 1482
                    },
                    {
                        name: "Иванов Иван",
                        img: "https://sun6-22.vkuserphoto.ru/s/v1/ig2/LgVFW7BY5QJDAfIMu6FxBZ65WkxQIPs9-YVYQVGqdims6hVhlyD1HjUqSQFvUYDSXpid2Rgxm-PQLsAzYIlH2yiP.jpg?quality=95&crop=192,130,768,768&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720&ava=1&cs=200x200",
                        date: 1753787205862,
                        message: "Тут какое-то последнее сообщение",
                        count: 1482
                    },
                    {
                        name: "Иванов Иван",
                        img: "https://sun6-22.vkuserphoto.ru/s/v1/ig2/LgVFW7BY5QJDAfIMu6FxBZ65WkxQIPs9-YVYQVGqdims6hVhlyD1HjUqSQFvUYDSXpid2Rgxm-PQLsAzYIlH2yiP.jpg?quality=95&crop=192,130,768,768&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720&ava=1&cs=200x200",
                        date: 1753787205862,
                        message: "Тут какое-то последнее сообщение",
                        count: 1482
                    },
                    {
                        name: "Иванов Иван",
                        img: "https://sun6-22.vkuserphoto.ru/s/v1/ig2/LgVFW7BY5QJDAfIMu6FxBZ65WkxQIPs9-YVYQVGqdims6hVhlyD1HjUqSQFvUYDSXpid2Rgxm-PQLsAzYIlH2yiP.jpg?quality=95&crop=192,130,768,768&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720&ava=1&cs=200x200",
                        date: 1753787205862,
                        message: "Тут какое-то последнее сообщение",
                        count: 1482
                    },
                    {
                        name: "Иванов Иван",
                        img: "https://sun6-22.vkuserphoto.ru/s/v1/ig2/LgVFW7BY5QJDAfIMu6FxBZ65WkxQIPs9-YVYQVGqdims6hVhlyD1HjUqSQFvUYDSXpid2Rgxm-PQLsAzYIlH2yiP.jpg?quality=95&crop=192,130,768,768&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720&ava=1&cs=200x200",
                        date: 1753787205862,
                        message: "Тут какое-то последнее сообщение",
                        count: 1482
                    },
                    {
                        name: "Иванов Иван",
                        img: "https://sun6-22.vkuserphoto.ru/s/v1/ig2/LgVFW7BY5QJDAfIMu6FxBZ65WkxQIPs9-YVYQVGqdims6hVhlyD1HjUqSQFvUYDSXpid2Rgxm-PQLsAzYIlH2yiP.jpg?quality=95&crop=192,130,768,768&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720&ava=1&cs=200x200",
                        date: 1753787205862,
                        message: "Тут какое-то последнее сообщение",
                        count: 1482
                    },
                ],
                activeMan: {
                    name: "Иванов Иван",
                    img: "https://sun6-22.vkuserphoto.ru/s/v1/ig2/LgVFW7BY5QJDAfIMu6FxBZ65WkxQIPs9-YVYQVGqdims6hVhlyD1HjUqSQFvUYDSXpid2Rgxm-PQLsAzYIlH2yiP.jpg?quality=95&crop=192,130,768,768&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720&ava=1&cs=200x200",
                    count: 1482,
                    username: "ivanovivan",
                    id: 42423599,
                    phone: "",
                    status: "Активный",
                    first_msg: "/start",
                    fisrt_active: 1753787205862, 
                    last_active: 1755095394934,
                    tags: ["Работа"],
                    userTags: ["Книги", "Спорт", "Работа", "Продвижение", "Искусство"],
                },
                isNewTags: false,
                tagBuffer: []
            }
        },
        created() {
            document.addEventListener('click', this.handleClickOutside);
        },
        methods: {
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
    }
    .dialog_field_footer {
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
    .dialog_people_item {
        position: relative;
        width: 100%;
        display: flex;
        column-gap: 10px;
        align-items: center;
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