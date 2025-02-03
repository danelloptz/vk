<template>
    <section class="rotation_preview" v-if="isRotationPreview">
        <span>Вы можете получать целевые просмотры и реакции на свой последний  пост совершенно бесплатно за счет прохождения Ротации постов.</span>
        <span>Ротация - это взаимовыгодная функция. Вам необходимо просмотреть 20 предложенных постов ВК,
            и в ответ получаете 10 просмотров вашего последнего поста. </span>
        <span>Если у Вас активен премиальный тариф, то Вы можете уменьшить количество личных просмотров до 10. Чтобы подключить премиум нажмите «Активировать тариф».</span>
        <div class="rotation_preview_btns">
            <AppBadButton :text="text1" @click="makeRotation"/>
            <AppGoodButton :text="text2" />
        </div>
    </section>
    <section class="rotation" v-if="isRotation">
        <span class="counter">Подписки {{ addGroups }} из {{ totalGroups }}</span>
        <div class="group">
            <AppGroupOrUser :v-if="groupInfo" :objectData="groupInfo" />
            <span>Необходимо просмотреть и поставить лайк на последний пост в группе, если есть закрепленное сообщение, пропустите его</span>
            <div class="groups_block_btns">
                <AppGoodButton :text="text3" @click="subscribeGroup" />
                <AppBadButton :text="`${text4} (${skipCounts})`" @click="skipGroup" />
            </div>
            <span class="error" v-if="noSkips">Не осталось пропусков!</span>
            <div class="row" v-if="noSubscribe">
                <img src="@/assets/images/cross.png" >
                <span class="error">Вы не поставили лайк на последний пост в группе, нажмите «Пропустить» или поставьте лайк</span>
            </div>
        </div>
    </section>
    <section class="rotation_end" v-if="isRotationEnd">
        <span class="counter">Подписки {{ addGroups }} из {{ totalGroups }}</span>
        <strong><span>Вы успешно прошли Ротацию групп!</span></strong>
        <span>Ваша группа добавлена в список Ротации. Вы можете проходить ротацию сколько угодно раз, ограничений с нашей стороны нет. Активируйте премиальный тариф, чтобы получать еще больше подписок и просмотров без прохождения Ротаций. Узнайте, как получить максимально выгодные условия прямо сейчас:</span>
        <AppGoodButton :text="text2" />
    </section>
</template>

<script>
    import AppGoodButton from "@/components/AppGoodButton.vue";
    import AppBadButton from "@/components/AppBadButton.vue";
    import AppGroupOrUser from "@/components/AppGroupOrUser.vue";
    // import { getGroupInfo, isSubscribe } from "@/services/user"; !!!! РАССКОМЕНТИТЬ !!!!

    export default {
        components: { AppGoodButton, AppBadButton, AppGroupOrUser },
        data() {
            return {
                text1: "НАЧАТЬ РОТАЦИЮ",
                text2: "АКТИВИРОВАТЬ ТАРИФ",
                text3: "ПОСМОТРЕТЬ ПОСТ",
                text4: "ПРОПУСТИТЬ",
                isRotation: false,
                isRotationPreview: true,
                isRotationEnd: false,
                addGroups: 19,
                totalGroups: 20,
                skipCounts: 10,
                noSubscribe: false,
                noSkips: false,
            }
        },
        async created() {
            this.getGroups();
        },
        methods: {
            makeRotation() {
                this.isRotationPreview = false;
                this.isRotationEnd = false;
                this.isRotation = true;
            },
            endRotation() {
                this.isRotationPreview = false;
                this.isRotationEnd = true;
                this.isRotation = false;
            },
            async getGroups() {
                // const response = await getGroupInfo(); !!!! РАССКОМЕНТИТЬ !!!!
                // console.log(response);
                // this.groupInfo = response;

                this.groupInfo = { // !!!!! СТАТИЧНАЯ ВЕРСИЯ, УДАЛИТЬ !!!!!
                    "avatar" : "https://geo-media.beatport.com/image_size/1400x1400/f0a20551-14f3-4fb0-896e-993ad866c3ea.jpg",
                    "first_name" : "Название группы ",
                    "last_name": "",
                    "sentence" : "Здесь написано какое-то вип-предложение",
                    "status": "Leader",
                    "links": {
                        "vk" : "https://vk.com/",
                        "telegram" : "https://telegram.com/",
                        "whatsapp" : "https://whatsapp.com/",
                    },
                    "groupLink" : "https://vk.com/profcom.petrsu",
                    "video": 'https://vkvideo.ru/video_ext.php?oid=-216921982&id=456239058&hash=93cbac827eb46d39&js_api=1',
                    "last_post": 'https://vk.com/profcom.petrsu?from=search&w=wall-38200854_40249'
                }
            },
            async subscribeGroup() {
                if (this.groupInfo) {
                    const newWindow = window.open(
                        this.groupInfo.last_post,
                        "_blank",
                        "width=800, height=600"
                    );
                    const intervalId = setInterval(async () => {
                        if (newWindow.closed) { 
                            clearInterval(intervalId); 
                            // const response = await isSubscribe(); !!!! РАССКОМЕНТИТЬ !!!!
                            // console.log(response);

                            const response = { // !!!! УДАЛИТЬ !!!!
                                "isSubscribe" :true
                            };

                            if (response.isSubscribe) {
                                this.addGroups = this.addGroups + 1;
                                if (this.addGroups == this.totalGroups) {
                                    this.endRotation();
                                }
                                this.getGroups();
                            }
                             else {
                                this.noSubscribe = true;
                            }
                        }
                    }, 500);
                    
                        
                }
            },
            skipGroup() {
                if (this.skipCounts == 0) 
                    this.noSkips = true
                else {
                    this.skipCounts--;
                    this.getGroups();
                }
            }
        }
    };
</script>

<style scoped>
    .rotation_preview {
        display: flex;
        flex-direction: column;
        row-gap: 20px;
        font-family: 'OpenSans';
    }
    .rotation_preview span {
        color: white;
        font-size: 18px;
    }
    .rotation_preview_btns {
        display: flex;
        column-gap: 30px;
    }
    .rotation, .rotation_end {
        display: flex;
        flex-direction: column;
        row-gap: 50px;
    }
    .rotation_end { row-gap: 30px; }
    .counter {
        font-size: 18px;
        color: white;
        font-family: 'OpenSans';
        padding: 10px 30px;
        background: #2F3251;
        width: fit-content;
        border-radius: 10px;
    }
    .group {
        display: flex;
        flex-direction: column;
        row-gap: 50px;
    }
    .groups_block_btns {
        display: flex;
        align-items: center;
        column-gap: 30px;
    }
    span {
        font-size: 18px;
        color: white;
        font-family: 'OpenSans';
    }
    .error {
        color: red;
    }
    .row {
        display: flex;
        align-items: center;
        column-gap: 20px;
    }
    .row img {
        width: 30px;
        height: 30px;
        object-fit: cover;
        object-position: center;
    }
</style>