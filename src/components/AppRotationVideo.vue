<template>
    <AppRotationPlans v-if="isPlans" />
    <AppVideoModal
        v-if="groupInfo"
        :visibility1="isVideoShown"
        :isWatched="isWatched"
        :link="groupInfo.video"
        @update:visibility1="isVideoShown = $event"
        @update:isWatched="isWatched = $event"
        @close="closeVideo" 
    />
    <section class="rotation_preview" v-if="isRotationPreview">
        <span>Вы можете получать целевые просмотры своего ВК видео совершенно бесплатно за счет прохождения Ротации. </span>
        <span>Ротация - это взаимовыгодная функция. Вам необходимо просмотреть 20 предложенных ВК видео по 20 секунд, и в ответ получаете 10 просмотров своего ВК видео.</span>
        <span>Если у вас активен премиальный тариф, то вы можете уменьшить количество личных просмотров до 10. Чтобы подключить премиум нажмите «Активировать тариф».</span>
        <div class="rotation_preview_btns">
            <AppBadButton :text="text1" @click="makeRotation"/>
            <AppGoodButton :text="text2" @click="openPlans" />
        </div>
    </section>
    <section class="rotation" v-if="isRotation">
        <span class="counter">Подписки {{ addGroups }} из {{ totalGroups }}</span>
        <div class="group">
            <AppGroupOrUser :v-if="groupInfo" :objectData="groupInfo" />
            <div class="groups_block_btns">
                <AppGoodButton :text="text3" @click="watchVideo" />
                <AppBadButton :text="`${text4} (${skipCounts})`" @click="skipGroup" />
            </div>
            <span class="error" v-if="noSkips">Не осталось пропусков!</span>
            <div class="row">
                <img src="@/assets/images/cross.png" v-if="notWatched">
                <span class="error" v-if="notWatched">Вы не посмотрели видео 20 секунд, нажмите «Пропустить» или запустите видео повторно</span>
            </div>
        </div>
    </section>
    <section class="rotation_end" v-if="isRotationEnd">
        <span class="counter">Просмотрено {{ addGroups }} из {{ totalGroups }}</span>
        <strong><span>Вы успешно прошли Ротацию видео!</span></strong>
        <span>Ваше видео добавлено в список Ротации. Вы можете проходить ротацию сколько угодно раз, ограничений с нашей стороны нет. Активируйте премиальный тариф, чтобы получать еще больше просмотров и подписок без прохождения Ротаций. Узнайте, как получить максимально выгодные условия прямо сейчас:</span>
        <AppGoodButton :text="text5" @click="openPlans" />
    </section>
</template>

<script>
    import AppGoodButton from "@/components/AppGoodButton.vue";
    import AppBadButton from "@/components/AppBadButton.vue";
    import AppGroupOrUser from "@/components/AppGroupOrUser.vue";
    import AppVideoModal from "@/components/AppVideoModal.vue";
    import AppRotationPlans from "@/components/AppRotationPlans.vue";
    import { addInRotation } from "@/services/groups";
    import { getUserInfo } from "@/services/user";
    // import { getGroupInfo } from "@/services/user"; !!!! РАССКОМЕНТИТЬ !!!!

    export default {
        components: { AppGoodButton, AppBadButton, AppGroupOrUser, AppVideoModal, AppRotationPlans },
        data() {
            return {
                text1: "НАЧАТЬ РОТАЦИЮ",
                text2: "АКТИВИРОВАТЬ ТАРИФ",
                text3: "ЗАПУСТИТЬ ВИДЕО",
                text4: "ПРОПУСТИТЬ",
                text5: "ВЫБРАТЬ ТАРИФ",
                isRotation: false,
                isRotationPreview: true,
                isRotationEnd: false,
                addGroups: 19,
                totalGroups: 20,
                skipCounts: 10,
                notWatched: false,
                noSkips: false,
                isVideoShown: false,
                isWatched: false,
                isPlans: false,
                userInfo: []
            }
        },
        async created() {
            const response = await getUserInfo(localStorage.getItem("token"));
            this.userInfo = response;
            this.getGroups();
        },
        methods: {
            makeRotation() {
                this.isRotationPreview = false;
                this.isRotationEnd = false;
                this.isRotation = true;
            },
            async endRotation() {
                const response = await addInRotation(this.userInfo.vk_id, "video");
                console.log(response.status);
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
            watchVideo() {
                this.isVideoShown = true;
            },
            skipGroup() {
                if (this.skipCounts == 0) 
                    this.noSkips = true
                else {
                    this.skipCounts--;
                    this.getGroups();
                }
            },
            closeVideo() {
                this.isVideoShown = false;
                if (this.isWatched) {
                    this.notWatched = false;
                    this.addGroups++;
                    if (this.addGroups == this.totalGroups)
                        this.endRotation();
                } else {
                    this.notWatched = true;
                }
            },
            openPlans() {
                this.isPlans = true;
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
        column-gap: 20px;
        align-items: center;
    }
    .row img {
        width: 30px;
        height: 30px;
        object-fit: cover;
        object-position: center;
    }
</style>