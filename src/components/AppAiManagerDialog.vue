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
        </div>
    </section>
</template>


<script>
    import AppGoodButton from '@/components/AppGoodButton.vue';
    export default {
        components: { AppGoodButton },
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
                }
            }
        },
        methods: {
            formatedDate(time) {
                const date = new Date(time);

                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();

                return `${day}.${month}.${year}`;
            },
        }
    };
</script>

<style scoped>
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