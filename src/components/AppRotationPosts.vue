<template>
    <AppRotationPlans v-if="isPlans" :userData="userData"  />
    <AppModalMessage 
        :visibility1="isModal"
        :link="groupsQueue[currentGroupIndex]?.post_link"
        :user="userData.id"
        @close="close"
        @update:visibility1="isModal = $event"
        @update:success="isSuccess = $event"
    />
    <AppModal 
        :title="title" 
        :message="msg" 
        :visibility1="isSuccess"
        @close="close"
        @update:visibility1="isSuccess = $event"
    />
    <section class="rotation_preview" v-if="isRotationPreview && !isPlans">
        <span>Вы можете получать целевые просмотры и реакции на свой последний  пост совершенно бесплатно за счет прохождения Ротации постов.</span>
        <span>Ротация - это взаимовыгодная функция. Вам необходимо просмотреть 20 предложенных постов ВК,
            и в ответ получаете 10 просмотров вашего последнего поста. </span>
        <span>Если у Вас активен премиальный тариф, то Вы можете уменьшить количество личных просмотров до 10. Чтобы подключить премиум нажмите «Выбрать тариф».</span>
        <div class="rotation_preview_btns">
            <AppBadButton class="btn" :text="text1" @click="makeRotation"/>
            <AppGoodButton class="btn" :text="text2" @click="openPlans" />
        </div>
    </section>
    <section class="rotation" v-if="isRotation && !isPlans">
        <span class="counter">Просмотры {{ addGroups }} из {{ totalGroups }}</span>
        <div class="group">
            <AppGroupOrUser :style="{ minWidth: windowWidth > 650 ? '550px' : '100%' }" :v-if="groupInfo" :objectData="groupsQueue[currentGroupIndex]" />
            <span>Необходимо просмотреть и поставить лайк на последний пост в группе, если есть закрепленное сообщение, пропустите его</span>
            <span class="error" v-if="noSkips"><img src="@/assets/images/cross2.png">Не осталось пропусков!</span>
            <span class="error" v-if="noSubscribe"><img src="@/assets/images/cross2.png">Вы не поставили лайк на последний пост в группе, нажмите «Пропустить» или поставьте лайк.</span>
            <span class="error" v-if="tooFast"><img src="@/assets/images/cross2.png">Слишком быстро, нажмите кнопку ещё раз и повторите действие.</span>
            <div class="groups_block_btns">
                <AppGoodButton :text="text3" class="btn" @click="subscribeGroup" />
                <AppGoodButton :text="text5" class="btn" @click="checkSubscription(groupsQueue[currentGroupIndex].post_link, groupsQueue[currentGroupIndex].group_id), userData.vk_id" />
                <AppBadButton :text="`${text4} (${skipCounts})`" class="btn" @click="skipGroup" />
                <AppBadButton class="btn" :text="text6" @click="openModal" />
            </div>
        </div>
    </section>
    <section class="rotation_end" v-if="isRotationEnd && !isPlans">
        <span class="counter">Просмотры {{ addGroups }} из {{ totalGroups }}</span>
        <strong><span>Вы успешно прошли Ротацию постов!</span></strong>
        <span>Ваша группа добавлена в список Ротации. Вы можете проходить ротацию сколько угодно раз, ограничений с нашей стороны нет. Активируйте премиальный тариф, чтобы получать еще больше подписок и просмотров без прохождения Ротаций. Узнайте, как получить максимально выгодные условия прямо сейчас:</span>
        <AppGoodButton :text="text2" @click="openPlans"  />
    </section>
</template>

<script>
    import AppGoodButton from "@/components/AppGoodButton.vue";
    import AppBadButton from "@/components/AppBadButton.vue";
    import AppGroupOrUser from "@/components/AppGroupOrUser.vue";
    import AppRotationPlans from "@/components/AppRotationPlans.vue";
    import { addInRotation, checkLike, getRotationPosts } from "@/services/groups";
    import AppModalMessage from "@/components/AppModalMessage.vue";
    import AppModal from "@/components/AppModal.vue";

    export default {
        components: { AppGoodButton, AppBadButton, AppGroupOrUser, AppRotationPlans, AppModalMessage, AppModal },
        props: { userData: Object },
        data() {
            return {
                text1: "НАЧАТЬ РОТАЦИЮ",
                text2: "ВЫБРАТЬ ТАРИФ",
                text3: "ПОСМОТРЕТЬ ПОСТ",
                text4: "ПРОПУСТИТЬ",
                text5: "ПРОВЕРИТЬ ЛАЙК",
                text6: "ПОЖАЛОВАТЬСЯ",
                isRotation: false,
                isRotationPreview: true,
                isRotationEnd: false,
                addGroups: 0,
                totalGroups: 20,
                skipCounts: 10,
                noSubscribe: false,
                tooFast: false,
                noSkips: false,
                isPlans: false,
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
                tariff: "",
                isModal: false,
                isSuccess: false,
                title: "УСПЕШНО",
                msg: "Ваше сообщение было успешно отправлено техподдержке. Спасибо за понимание!"
            }
        },
        async created() {
            this.tariff = this.userData.packages[this.userData.packages.length - 1].package_name;
            if (this.isTarif) {
                this.openPlans();
                this.$emit("update:isTarif", false);
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

            const groups = await getRotationPosts(this.userData.vk_id, this.tariff);
            console.log(groups);

            this.groupInfo = groups;
            if (localStorage.getItem("addPosts")) this.addGroups = localStorage.getItem("addPosts");


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
            openModal() {
                this.isModal = true;
            },
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
                const response = await addInRotation(this.userData.vk_id, "post");
                console.log(response.status);
                this.isRotationPreview = false;
                this.isRotationEnd = true;
                this.isRotation = false;
                localStorage.setItem("addPosts", 0);
            },
            async subscribeGroup() {
                if (!this.groupsQueue.length) return;
                if (this.groupInfo) {
                    const post_link = this.groupsQueue[this.currentGroupIndex].post_link;
                    console.log(this.groupsQueue[this.currentGroupIndex]);
                    this.blurTime = Date.now();
                    this.waitingForCheck = true; // Устанавливаем флаг ожидания проверки
                    window.open(post_link, "_blank", "width=800, height=600");

                }
            },
            async checkSubscription(post_link, group_id) {
                if (!this.waitingForCheck) return;
                this.waitingForCheck = false;
                const response = await checkLike(post_link, group_id, this.userData.vk_id);
                if (!response) location.reload();
                console.log(response);

                if (response.status) {
                    this.addGroups++;
                    localStorage.setItem("addPosts", this.addGroups);
                    this.groupsQueue.splice(this.currentGroupIndex, 1);
                    this.subscribedCount++;
                    this.noSubscribe = false;
                    this.tooFast = false;

                    if (this.addGroups === this.totalGroups) {
                        this.endRotation();
                    }
                    if ((this.subscribedCount >= 5 && this.groupPriorities[this.currentGroupIndex] == "other") ||
                        (this.subscribedCount >= 10 && this.groupPriorities[this.currentGroupIndex] != "other") || 
                        this.groupsQueue.length === 0)  {
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
                    this.noSkips = false;
                    this.noSubscribe = false;
                    this.tooFast = false;
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
                    const group_id = this.groupsQueue[this.currentGroupIndex].group_id;
                    const post_link = this.groupsQueue[this.currentGroupIndex].post_link;

                    this.checkSubscription(post_link, group_id, this.userData.vk_id);
                }
            },
            handleFocus() {
                if (this.waitingForCheck) {
                    const elapsed = Date.now() - this.blurTime;
                    if (elapsed > 1000) { // Например, если прошло более 5 секунд
                        this.tooFast = false;
                        const group_id = this.groupsQueue[this.currentGroupIndex].group_id;
                        const post_link = this.groupsQueue[this.currentGroupIndex].post_link;

                        this.checkSubscription(post_link, group_id, this.userData.vk_id);
                    } else {
                        console.log("Пользователь вернулся слишком быстро, возможно, не подписался.");
                        this.tooFast = true;
                    }
                }
            },
            openPlans() {
                this.isPlans = true;
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
                if (newValue) this.openPlans();
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
        @media (max-width: 650px) {
            font-size: 14px;
        }
    }
    .rotation_preview_btns {
        display: flex;
        column-gap: 30px;
        @media (max-width: 650px) {
            flex-direction: column;
            align-items: center;
            row-gap: 21px;
            margin-top: 10px;
        }
    }
    .btn {
        @media (max-width: 650px) {
            width: 210px;
        }
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
        @media (max-width: 650px) {
            font-size: 14px;
            padding: 8px 21px;
        }
    }
    .group {
        display: flex;
        flex-direction: column;
        row-gap: 50px;
        @media (max-width: 650px) {
            row-gap: 30px;
        }
    }
    .groups_block_btns {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        column-gap: 30px;
        row-gap: 10px;
        @media (max-width: 650px) {
            flex-direction: column;
            align-items: center;
            row-gap: 21px;
        }
    }
    span {
        font-size: 18px;
        color: white;
        font-family: 'OpenSans';
    }
    .error {
        color: #FF6666;
        display: flex;
        align-items: center;
        font-size: 14px;
    }
    .error img {
        width: 20px;
        height: 20px;
        margin-right: 10px;
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