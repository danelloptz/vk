<template>
    <AppModalMessage 
        :visibility1="isModal"
        :link="this.groupsQueue[this.currentGroupIndex]?.group_link"
        :user="userInfo.id"
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
    <section class="modal">
        <div class="modal-background"></div>
        <img src="@/assets/images/close.png" class="close" @click="this.$router.push('/signup_1')">
        <div class="text_wrapper">
            <h1>ШАГ 2 - ПОДПИШИТЕСЬ НА УКАЗАННЫЕ ГРУППЫ</h1>
            <span style="font-weight: bold;">Почему это важно?</span>
            <span>1. Это активирует ваш аккаунт и искусственный интеллект поможет вам вести бизнес на полном автомате, включая рекламу и подписную базу.</span>
            <span>2. Вы займете место в бинаре и с этого момента начнете получать перелив от вышестоящих рефереров, что открывает для вас невероятные финансовые возможности. Время — ваш главный союзник.</span>
            <span>3. Сразу после активации получите подарок — «Как удвоить продажи через ВК за 30 дней. 10 секретов быстрого продвижения бизнеса».</span>
            <span>Активируйтесь прямо сейчас и используйте все преимущества сервиса Intelektaz!</span>
        </div>
        <div class="add_block">
            <span>Добавлено {{ addGroups }} из {{ totalGroups }}</span>
            <hr>
        </div>
        <div class="groups_block">
            <AppGroupOrUser style="width: 100%;" :v-if="groupInfo" :objectData="groupsQueue[currentGroupIndex]" />
            <div class="groups_block_btns">
                <AppGoodButton :text="text1" @click="subscribeGroup" />
                <AppGoodButton class="big_btn" :text="text3" @click="checkSubscription(groupsQueue[currentGroupIndex]?.vk_id)" />
                <AppBadButton :text="`${text2} (${skipCounts})`" @click="skipGroup" />
                <AppBadButton :text="text4" @click="openModal" />
                <span class="error_message" v-if="noSkips">Не осталось пропусков!</span>
                <span class="error_message" v-if="noSubscribe">Не подписались!</span>
                <span class="error_message" v-if="tooFast"><img src="@/assets/images/cross2.png">Слишком быстро, нажмите кнопку ещё раз и повторите действие.</span>
            </div>
        </div>
    </section>
</template>

<script>
    import AppGroupOrUser from '@/components/AppGroupOrUser.vue';
    import AppGoodButton from '@/components/AppGoodButton.vue';
    import AppBadButton from '@/components/AppBadButton.vue';
    // import { getGroupInfo, isSubscribe } from '@/services/user';  !!!!! РАБОЧАЯ ВЕРСИЯ, РАССКОМЕНТИРОВАТЬ !!!!!
    import { checkGroupSub, getGroups, subToGroup } from '@/services/groups';
    import { getUserInfo } from '@/services/user';
    import { refreshToken, changeStatus } from '@/services/auth';
    import { getSubTgChannels } from '@/services/tg';
    import AppModalMessage from '@/components/AppModalMessage.vue';
    import AppModal from '@/components/AppModal.vue';

    export default {
        components: { AppGroupOrUser, AppGoodButton, AppBadButton, AppModalMessage, AppModal },
        data() {
            return {
                addGroups: 0,
                totalGroups: 25,
                skipCounts: 10,
                groupInfo: null,
                userInfo: [],
                text1: "ПОДПИСАТЬСЯ",
                text2: "ПРОПУСТИТЬ",
                text3: "ПРОВЕРИТЬ ПОДПИСКУ",
                text4: "ПОЖАЛОВАТЬСЯ",
                noSkips: false,
                noSubscribe: false,
                tooFast: false,
                currentGroupIndex: 0,
                groupPriorities: ["first", "second", "third_and_fourth", "fifth", "other"],
                currentPriorityIndex: 0,
                groupsQueue: [],
                subscribedCount: 0,
                waitingForCheck: false, // Флаг для отслеживания момента проверки подписки
                wasBlurred: false,
                blurTime: 0,
                isModal: false,
                isSuccess: false,
                title: "УСПЕШНО",
                msg: "Ваше сообщение было успешно отправлено техподдержке. Спасибо за понимание!"
            };
        },
        async created() {
            const lcs_addGroups = localStorage.getItem("addGroups");
            let response = await getUserInfo(localStorage.getItem("token"));
            if (!response) {
                const isAuthorized = await refreshToken(localStorage.getItem("token_refresh"));
                console.log(isAuthorized);
                if (isAuthorized) {
                    localStorage.setItem("token", isAuthorized.access_token);
                    localStorage.setItem("token_refresh", isAuthorized.refresh_token);
                    response = await getUserInfo(localStorage.getItem("token"));
                    if (!response) {
                        localStorage.clear();
                        if (lcs_addGroups) localStorage.setItem("addGroups", lcs_addGroups);
                        this.$router.push('/');
                        return;
                    }
                } else {
                    localStorage.clear();
                    if (lcs_addGroups) localStorage.setItem("addGroups", lcs_addGroups);
                    this.$router.push('/');
                    return;
                }
            }
            this.userInfo = response;
            if (lcs_addGroups) this.addGroups = lcs_addGroups || 0;
            if (this.addGroups >= this.totalGroups) {
                // this.watchVideo();
                console.log("END");
                const updateUser = await changeStatus(this.userInfo.vk_access_token);
                if (updateUser.status) {
                    localStorage.removeItem("addGroups");
                    this.$router.push("/signup_3");
                }
            }
            let groups;
            if (this.userInfo.tg_id) {
                groups = await getSubTgChannels(this.userInfo.id);
            } else {
                groups = await getGroups(this.userInfo.vk_id);
            }
            this.groupInfo = groups;
            console.log(this.groupInfo);
            this.updateGroupQueue();

            // Добавляем обработчики событий
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
                    console.log("Обновляем очередь групп");
                    this.groupsQueue = this.groupInfo[priorityKey].slice(); // Копируем массив групп
                    this.currentGroupIndex = 0;
                }
            },
            async subscribeGroup() {
                if (!this.groupsQueue.length) return;
                if (this.groupInfo) {
                    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                    if (isMobile) { 
                        const resp = await subToGroup(this.userInfo.vk_access_token, this.groupsQueue[this.currentGroupIndex].group_link);
                        if (!resp) location.reload();
                        if (resp.status) {
                            const groupId = String(this.groupsQueue[this.currentGroupIndex].vk_id);
                            await checkGroupSub(groupId, this.userInfo.vk_id, "registration");
                            this.waitingForCheck = false;
                            this.addGroups++;
                            localStorage.setItem("addGroups", this.addGroups);
                            this.groupsQueue.splice(this.currentGroupIndex, 1);
                            this.subscribedCount++;
                            this.noSubscribe = false;
                            this.tooFast = false;

                            console.log(this.addGroups, this.totalGroups);
                            if (this.addGroups >= this.totalGroups) {
                                // this.watchVideo();
                                console.log("END");
                                const updateUser = await changeStatus(this.userInfo.vk_access_token);
                                if (updateUser.status) {
                                    localStorage.removeItem("addGroups");
                                    this.$router.push("/signup_3");
                                }
                            }
                            if ((this.subscribedCount >= 5 && this.groupPriorities[this.currentGroupIndex] == "other") ||
                                (this.subscribedCount >= 10 && this.groupPriorities[this.currentGroupIndex] != "other") || 
                                this.groupsQueue.length === 0) {
                                    this.nextPriorityGroup();
                            }
                        } else {
                            this.noSubscribe = true;
                        }
                    } else {
                        const groupLink = this.groupsQueue[this.currentGroupIndex].group_link;
                        this.blurTime = Date.now();
                        this.waitingForCheck = true; // Устанавливаем флаг ожидания проверки
                        window.open(groupLink, "_blank", "width=800, height=600");
                    }
                }
            },
            async checkSubscription(groupLink) {
                if (!this.waitingForCheck) return;
                this.waitingForCheck = false;
                let response;
                try {
                    response = await checkGroupSub(String(groupLink), this.userInfo.vk_id, "registration");
                    if (!response) location.reload();
                } catch(err) {
                    location.reload();
                }
                
                console.log(response);

                if (response.status) {
                    this.addGroups++;
                    this.groupsQueue.splice(this.currentGroupIndex, 1);
                    this.subscribedCount++;
                    localStorage.setItem("addGroups", this.addGroups);
                    this.noSubscribe = false;
                    this.tooFast = false;

                    if (this.addGroups === this.totalGroups) {
                        console.log("сработал changestatus", this.addGroups, this.totalGroups);
                        const updateUser = await changeStatus(this.userInfo.vk_access_token);
                        if (updateUser.status) {
                            localStorage.removeItem("addGroups");
                            this.$router.push("/signup_3");
                        }
                            
                    }

                    const curr_group = this.groupPriorities[this.currentPriorityIndex];
                    console.log(curr_group);
                    if ((this.subscribedCount >= 10 && curr_group == "third_and_fourth") || (this.subscribedCount >= 5 && curr_group != "third_and_fourth" && curr_group != "fifth") || this.groupsQueue.length === 0) {
                        this.nextPriorityGroup();
                    }
                } else {
                    this.noSubscribe = true;
                }
            },
            skipGroup() {
                console.log("Пропустили группу");
                if (this.skipCounts === 0) {
                    this.noSkips = true;
                } else {
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
                    this.checkSubscription(this.groupsQueue[this.currentGroupIndex]?.vk_id);
                }
            },
            handleFocus() {
                if (this.waitingForCheck) {
                    const elapsed = Date.now() - this.blurTime;
                    if (elapsed > 1000) { // Например, если прошло более 5 секунд
                        this.tooFast = false;
                        this.checkSubscription(this.groupsQueue[this.currentGroupIndex]?.vk_id);
                    } else {
                        console.log("Пользователь вернулся слишком быстро, возможно, не подписался.");
                        this.tooFast = true;
                    }
                }
            },
        },
    };
</script>

<style scoped>
    @font-face {
        font-family: 'Tektur';
        src: url('@/assets/fonts/Tektur.ttf') format('truetype');
    }
    @font-face {
        font-family: 'OpenSans';
        src: url('@/assets/fonts/OpenSans.ttf') format('truetype');
    }

    h3 {
        font-size: 18px;
        color: white;
        font-family: 'OpenSans';
        font-weight: normal;
    }
    h1, h2, span, img {
        z-index: 5;
    }

    .modal {
        width: 1160px;
        border-radius: 10px;
        position: relative; /* Обеспечиваем позиционирование для псевдоэлемента */
        display: flex;
        flex-direction: column;
        /* align-items: center; */
        padding: 50px;
        z-index: 2;
        overflow-y: auto;
        scrollbar-width: none;
        row-gap: 30px;
        box-sizing: border-box;
        @media (max-width: 1400px) {
            width: 80vw;
        }
        @media (max-width: 650px) {
            width: 90vw;
            padding: 60px 15px;
        }
    }

    .modal::-webkit-scrollbar {
        width: 0;  
        height: 0;
    }

    .modal::-webkit-scrollbar-thumb {
        background: transparent;
    }

    .close {
        position: absolute;
        right: 30px;
        top: 30px;
        width: 21px;
        height: 21px;
        cursor: pointer;
        @media (max-width: 450px) {
            right: 20px;
            top: 20px;
        }
    }
    .modal-background {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: url("@/assets/images/background.png");
        background-color: #1B1E3D;
        background-size: contain;
        background-position: center;
        background-blend-mode: multiply;
        background-repeat: repeat-y;
        opacity: 0.25; 
        background-size: 300%;
        filter: brightness(140%) contrast(80%);
        border-radius: 10px;
    }
    .text_wrapper {
        display: flex;
        flex-direction: column;
        align-items: start;
        row-gap: 20px;
    }
    h1 {
        font-size: 36px;
        color: white;
        font-family: 'Tektur';
        line-height: 62.4px;
        font-weight: 400;
        @media (max-width: 900px) {
            font-size: 35px;
            line-height: normal;
        }
        @media (max-width: 500px) {
            font-size: 24px;
        }
    }
    span {
        font-size: 18px;
        font-family: 'OpenSans';
        font-weight: 400;
        line-height: 32.68px;
        color: white;
        text-wrap: wrap;
        text-align: left;
        font-family: 'OpenSans';
        @media (max-width: 900px) {
            font-size: 20px;
        }
        @media (max-width: 650px) {
            font-size: 16px;
        }
    }
    .add_block {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .add_block span {
        background: #2F3251;
        color: white;
        padding: 0px 20px;
        border-radius: 5px 5px 0px 0px;
        line-height: 2;
        @media (max-width: 500px) {
            font-size: 14px;
        }
    }
    hr {
        width: 100%;
        height: 1px;
        background-color: white;
        @media (max-width: 900px) {
            width: 95%;
        }
    }
    .groups_block {
        display: flex;
        justify-content: space-between;
        align-items: center;
        column-gap: 20px;
        @media (max-width: 1100px) {
            flex-direction: column;
            row-gap: 30px;
            align-items: center;
        }
    }
    .groups_block_btns {
        display: flex;
        column-gap: 20px;
        flex-direction: column;
        row-gap: 20px;
        @media (max-width: 900px) {
            justify-content: center;
            flex-direction: row;
        }
        @media (max-width: 650px) {
            flex-direction: column;
        }
    }
    .error_message {
        font-size: 14px;
        color: red;
        position: absolute;
        bottom: 0px;
        right: 50px;
    }

</style>