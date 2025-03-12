<template>
    <AppRotationPlans v-if="isPlans" />
    <AppVideoModal
        v-if="videosInfo"
        :visibility1="isVideoShown"
        :isWatched="isWatched"
        :link="videosQueue[currentVideoIndex].video_link"
        @update:visibility1="isVideoShown = $event"
        @update:isWatched="isWatched = $event"
        @close="closeVideo" 
    />
    <section class="rotation_preview" v-if="isRotationPreview && !isPlans">
        <span>Вы можете получать целевые просмотры своего ВК видео совершенно бесплатно за счет прохождения Ротации. </span>
        <span>Ротация - это взаимовыгодная функция. Вам необходимо просмотреть 20 предложенных ВК видео по 20 секунд, и в ответ получаете 10 просмотров своего ВК видео.</span>
        <span>Если у вас активен премиальный тариф, то вы можете уменьшить количество личных просмотров до 10. Чтобы подключить премиум нажмите «Активировать тариф».</span>
        <div class="rotation_preview_btns">
            <AppBadButton :text="text1" @click="makeRotation"/>
            <AppGoodButton :text="text2" @click="openPlans" />
        </div>
    </section>
    <section class="rotation" v-if="isRotation && !isPlans">
        <span class="counter">Просмотры {{ watchedVideos }} из {{ totalVideos }}</span>
        <div class="group">
            <AppGroupOrUser :v-if="videosInfo" :objectData="videosQueue[currentVideoIndex]" />
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
    <section class="rotation_end" v-if="isRotationEnd && !isPlans">
        <span class="counter">Просмотрено {{ watchedVideos }} из {{ totalVideos }}</span>
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
    import { addInRotation, getRotationVideos } from "@/services/groups";
    import { getUserInfo } from "@/services/user";
    import { refreshToken } from "@/services/auth";
    import { addView } from "@/services/groups";
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
                watchedVideos: 0,
                totalVideos: 20,
                notWatched: false,
                
                skipCounts: 10,
                noSubscribe: false,
                noSkips: false,
                isPlans: false,
                userInfo: [],
                currentVideoIndex: 0,
                groupPriorities: ["first", "second", "other"],
                currentPriorityIndex: 0,
                videosQueue: [],
                videosInfo: null,
                isVideoShown: false,
                visibility1: false, 
                isWatched: false, 
                waitingForCheck: false,
                subscribedCount: 0,
                wasBlurred: false,
                blurTime: 0,
                tariff: ""
            }
        },
        async created() {
            const response = await getUserInfo(localStorage.getItem("token"));
            if (!response) {
                const isAuthorized = await refreshToken(localStorage.getItem("token_refresh"));
                if (isAuthorized) {
                    localStorage.setItem("token", isAuthorized.access_token);
                    localStorage.setItem("token_refresh", isAuthorized.refresh_token);
                } else {
                    localStorage.clear();
                    this.$router.push('/');
                    return;
                }
            }
            this.userInfo = response;
            this.tariff = this.userInfo.packages[this.userInfo.packages.length - 1].package_name;

            if (this.isTarif) {
                this.openPlans();
                this.$emit("update:isTarif", false);
            }
            switch (this.tariff) {
                case "Free": 
                    this.totalVideos = 20;
                    this.skipCounts = 10;
                    break;
                case "Start":
                    this.totalVideos = 15;
                    this.skipCounts = 7;
                    break;
                default:
                    this.totalVideos = 10;
                    this.skipCounts = 5;
                    break;
            }

            const videos = await getRotationVideos(this.userInfo.vk_id, this.tariff);
            console.log(videos);

            this.videosInfo = videos;

            this.videosInfo.first.forEach(item => {
                item["package_name"] = "Leader";
            });
            this.videosInfo.second.forEach(item => {
                item["package_name"] = "VIP";
            });
            this.videosInfo.other.forEach(item => {
                item["package_name"] = "Free";
            });

            this.updateVideosQueue();

        },
        methods: {
            makeRotation() {
                this.isRotationPreview = false;
                this.isRotationEnd = false;
                this.isRotation = true;
            },
            
            updateVideosQueue() {
                const priorityKey = this.groupPriorities[this.currentPriorityIndex];
                if (this.videosInfo && this.videosInfo[priorityKey]) {
                    console.log("обновляем очередь групп");
                    this.videosQueue = this.videosInfo[priorityKey].slice(); // Копируем массив групп
                    if (this.videosQueue.length == 0) this.nextPriorityVideo();
                    this.currentVideoIndex = 0;
                }
            },
            async endRotation() {
                const response = await addInRotation(this.userInfo.vk_id, "video");
                console.log(response.status);
                this.isRotationPreview = false;
                this.isRotationEnd = true;
                this.isRotation = false;
            },
            skipGroup() {
                console.log("пропустили группу");
                if (this.skipCounts == 0) 
                    this.noSkips = true
                else {
                    this.skipCounts--;
                    this.videosQueue.splice(this.currentVideoIndex, 1);
                    if (this.videosQueue.length === 0) {
                        this.nextPriorityVideo();
                    }
                }
            },
            nextPriorityVideo() {
                console.log("Новая группа");
                this.subscribedCount = 0;
                this.currentPriorityIndex++;

                if (this.currentPriorityIndex < this.groupPriorities.length) {
                    this.updateVideosQueue();
                } else {
                    console.log("Все группы обработаны.");
                }
            },
            watchVideo() {
                // if (!this.videosQueue.length) return;
                console.log(this.videosQueue[this.currentVideoIndex]);
                this.isVideoShown = true;
            },
            async closeVideo() {
                this.isVideoShown = false;
                if (this.isWatched) {
                    this.isWatched = false;
                    const resp = await addView(this.userInfo.id, this.videosQueue[this.currentVideoIndex].db_id);
                    console.log(this.userInfo.id, this.videosQueue[this.currentVideoIndex].db_id, resp);
                    this.watchedVideos++;
                    this.videosQueue.splice(this.currentVideoIndex, 1);
                    this.subscribedCount++;

                    if (this.watchedVideos === this.totalVideos) {
                        this.endRotation();
                    }
                    if ((this.subscribedCount >= 5 && this.groupPriorities[this.currentVideoIndex] == "other") ||
                        (this.subscribedCount >= 10 && this.groupPriorities[this.currentVideoIndex] != "other") || 
                        this.videosQueue.length === 0) {
                            this.nextPriorityVideo();
                    }

                    this.notWatched = false;
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