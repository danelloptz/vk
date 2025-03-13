<template>
    <AppVideoModal
        v-if="groupInfo"
        :visibility1="isVideoShown"
        :isWatched="isWatched"
        :link="groupInfo.videos?.[0]?.link || defaultLink"
        :uncloseable="true"
        @update:visibility1="isVideoShown = $event"
        @update:isWatched="isWatched = $event"
        @close="closeVideo" 
    />
    <AppRotationPlans v-if="isPlans" />
    <section class="rotation_preview" v-if="isRotationPreview && !isPlans && !isTarif">
        <span>Вы можете увеличить количество целевых подписчиков на свою ВК группу совершенно бесплатно за счет прохождения Ротации. </span>
        <span>Ротация - это взаимовыгодная функция. Вам необходимо подписаться на 20 предложенных ВК групп, посмотреть одно ВК видео 20 секунд, и в ответ получаете 10 подписок на свою ВК группу.</span>
        <span>Если у вас активен премиальный тариф, то вы можете уменьшить количество личных подписок до 10. Чтобы подключить премиум нажмите «Выбрать тариф».</span>
        <div class="rotation_preview_btns">
            <AppBadButton :text="text1" @click="makeRotation"/>
            <AppGoodButton :text="text2" @click="openPlans" />
        </div>
    </section>
    <section class="rotation" v-if="isRotation && !isPlans && !isTarif">
        <span class="counter">Подписки {{ addGroups }} из {{ totalGroups }}</span>
        <div class="group">
            <AppGroupOrUser style="min-width: 550px;" :v-if="groupInfo" :objectData="groupsQueue[currentGroupIndex]" />
            <div class="groups_block_btns">
                <AppGoodButton :text="text3" @click="subscribeGroup" />
                <AppBadButton :text="`${text4} (${skipCounts})`" @click="skipGroup" />
                <span class="error" v-if="noSkips">Не осталось пропусков!</span>
                <span class="error" v-if="noSubscribe">Не подписались!</span>
            </div>
        </div>
    </section>
    <section class="rotation_end" v-if="isRotationEnd && !isPlans && !isTarif">
        <span class="counter">Подписки {{ addGroups }} из {{ totalGroups }}</span>
        <strong><span>Вы успешно прошли Ротацию групп!</span></strong>
        <span>Ваша группа добавлена в список Ротации. Вы можете проходить ротацию сколько угодно раз, ограничений с нашей стороны нет. Активируйте премиальный тариф, чтобы получать еще больше подписок и просмотров без прохождения Ротаций. Узнайте, как получить максимально выгодные условия прямо сейчас:</span>
        <AppGoodButton :text="text2" @click="openPlans"  />
    </section>
</template>

<script>
    import AppGoodButton from "@/components/AppGoodButton.vue";
    import AppBadButton from "@/components/AppBadButton.vue";
    import AppGroupOrUser from "@/components/AppGroupOrUser.vue";
    import AppRotationPlans from "@/components/AppRotationPlans.vue";
    import AppVideoModal from "@/components/AppVideoModal.vue";

    import { addInRotation, checkGroupSub, getRotationGroups } from "@/services/groups";
    import { getUserInfo } from "@/services/user";
    import { refreshToken } from "@/services/auth";

    export default {
        components: { AppGoodButton, AppBadButton, AppGroupOrUser, AppRotationPlans, AppVideoModal },
        props: {
            isTarif: Boolean
        },
        data() {
            return {
                text1: "НАЧАТЬ РОТАЦИЮ",
                text2: "ВЫБРАТЬ ТАРИФ",
                text3: "ПОДПИСАТЬСЯ",
                text4: "ПРОПУСТИТЬ",
                isRotation: false,
                isRotationPreview: true,
                isRotationEnd: false,
                addGroups: 0,
                totalGroups: 20,
                skipCounts: 10,
                noSubscribe: false,
                noSkips: false,
                isPlans: false,
                userInfo: [],
                currentGroupIndex: 0,
                groupPriorities: ["first", "second", "other"],
                currentPriorityIndex: 0,
                groupsQueue: [],
                groupInfo: null,
                isVideoShown: false,
                visibility1: false, 
                isWatched: false, 
                defaultLink: "https://vkvideo.ru/video-216921982_456239058?t=8s",
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
                console.log('Я СРАБОТАЛ НА ПРОПСЕ!!!!');
                this.openPlans();
                // this.$emit("update:isTarif", false);
                console.log('сделал false');
            }
            switch (this.tariff) {
                case "Free": 
                    this.totalGroups = 20;
                    this.skipCounts = 10;
                    break;
                case "Start":
                    this.totalGroups = 15;
                    this.skipCounts = 7;
                    break;
                default:
                    this.totalGroups = 10;
                    this.skipCounts = 5;
                    break;
            }

            const groups = await getRotationGroups(this.userInfo.vk_id, this.tariff);
            console.log(groups);

            this.groupInfo = groups;

            // this.groupInfo.first.forEach(item => {
            //     item["package_name"] = "Leader";
            // });
            // this.groupInfo.second.forEach(item => {
            //     item["package_name"] = "VIP";
            // });
            // this.groupInfo.other.forEach(item => {
            //     item["package_name"] = "Free";
            // });

            this.updateGroupQueue();

            window.addEventListener("blur", () => {
                this.wasBlurred = true;
                this.blurTime = Date.now();
            });

            window.addEventListener("focus", () => {
                if (this.wasBlurred) {
                    const elapsed = Date.now() - this.blurTime; // Сколько времени вкладка была неактивной
                    if (elapsed > 500) {
                        this.handleFocus();
                    }
                    this.wasBlurred = false;
                }
            });
        },
        methods: {
            updateGroupQueue() {
                const priorityKey = this.groupPriorities[this.currentPriorityIndex];
                if (this.groupInfo && this.groupInfo[priorityKey]) {
                    console.log("обновляем очередь групп");
                    this.groupsQueue = this.groupInfo[priorityKey].slice(); // Копируем массив групп
                    if (this.groupsQueue.length == 0) this.nextPriorityGroup();
                    this.currentGroupIndex = 0;
                }
            },
            makeRotation() {
                this.isRotationPreview = false;
                this.isRotationEnd = false;
                this.isRotation = true;
            },
            async endRotation() {
                const response = await addInRotation(this.userInfo.vk_id, "group");
                console.log(response.status);
                this.isRotationPreview = false;
                this.isRotationEnd = true;
                this.isRotation = false;
            },
            async subscribeGroup() {
                if (!this.groupsQueue.length) return;
                if (this.groupInfo) {
                    const groupLink = this.groupsQueue[this.currentGroupIndex].group_link;
                    this.blurTime = Date.now();
                    this.waitingForCheck = true; // Устанавливаем флаг ожидания проверки
                    window.open(groupLink, "_blank", "width=800, height=600");

                }
            },
            async checkSubscription(groupLink) {
                if (!this.waitingForCheck) return;
                this.waitingForCheck = false;
                console.log(groupLink);
                const response = await checkGroupSub(groupLink, this.userInfo.vk_id, "rotation");
                console.log(response);

                if (response.status) {
                    this.addGroups++;
                    this.groupsQueue.splice(this.currentGroupIndex, 1);
                    this.subscribedCount++;
                    this.noSubscribe = false;

                    if (this.addGroups === this.totalGroups) {
                        this.watchVideo();
                    }
                    if ((this.subscribedCount >= 5 && this.groupPriorities[this.currentGroupIndex] == "other") ||
                        (this.subscribedCount >= 10 && this.groupPriorities[this.currentGroupIndex] != "other") || 
                        this.groupsQueue.length === 0) {
                            this.nextPriorityGroup();
                    }
                } else {
                    this.noSubscribe = true;
                }
            },
            skipGroup() {
                console.log("пропустили группу");
                if (this.skipCounts == 0) 
                    this.noSkips = true
                else {
                    this.skipCounts--;
                    this.groupsQueue.splice(this.currentGroupIndex, 1);
                    if (this.groupsQueue.length === 0) {
                        this.nextPriorityGroup();
                    }
                }
            },
            nextPriorityGroup() {
                console.log("Новая группа");
                this.subscribedCount = 0;
                this.currentPriorityIndex++;

                if (this.currentPriorityIndex < this.groupPriorities.length) {
                    this.updateGroupQueue();
                } else {
                    console.log("Все группы обработаны.");
                }
            },
            handleVisibilityChange() {
                if (!document.hidden && this.waitingForCheck) {
                    this.checkSubscription(this.groupsQueue[this.currentGroupIndex]?.group_link);
                }
            },
            handleFocus() {
                if (this.waitingForCheck) {
                    const elapsed = Date.now() - this.blurTime;
                    if (elapsed > 5000) { // Например, если прошло более 5 секунд
                        this.checkSubscription(this.groupsQueue[this.currentGroupIndex]?.group_link);
                    } else {
                        console.log("Пользователь вернулся слишком быстро, возможно, не подписался.");
                    }
                }
            },
            openPlans() {
                // this.isPlans = true;
                // this.$emit("update:isTarif", true);
                this.$emit('openPlans');
            },
            watchVideo() {
                this.isVideoShown = true;
            },
            closeVideo() {
                this.isVideoShown = false;
                if (this.isWatched) {
                    console.log("посмотрели видео");
                    this.notWatched = false;
                    this.endRotation();
                } else {
                    console.log("не посмотрели видео");
                    this.notWatched = true;
                }
            },
        },
        watch: {
            isTarif(newValue) {
                if (newValue) {
                    console.log('Я СРАБОТАЛ!!!');
                    this.openPlans();
                    // this.$emit("update:isTarif", false);
                } else {
                    this.isPlans = newValue;
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
</style>