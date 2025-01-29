<template>
    <section class="rotation_preview" v-if="isRotationPreview">
        <span>Вы можете увеличить количество целевых подписчиков на свою ВК группу совершенно бесплатно за счет прохождения Ротации. </span>
        <span>Ротация - это взаимовыгодная функция. Вам необходимо подписаться на 20 предложенных ВК групп, посмотреть одно ВК видео 20 секунд, и в ответ получаете 10 подписок на свою ВК группу.</span>
        <span>Если у вас активен премиальный тариф, то вы можете уменьшить количество личных подписок до 10. Чтобы подключить премиум нажмите «Выбрать тариф».</span>
        <div class="rotation_preview_btns">
            <AppBadButton :text="text1" @click="makeRotation"/>
            <AppGoodButton :text="text2" />
        </div>
    </section>
    <section class="rotation" v-if="isRotation">
        <span class="counter">Подписки {{ addGroups }} из {{ totalGroups }}</span>
        <div class="group">
            <AppGroupOrUser :v-if="groupInfo" :objectData="groupInfo" />
            <div class="groups_block_btns">
                <AppGoodButton :text="text3" @click="subscribeGroup" />
                <AppBadButton :text="`${text4} (${skipCounts})`" @click="skipGroup" />
                <span class="error" v-if="noSkips">Не осталось пропусков!</span>
                <span class="error" v-if="noSubscribe">Не подписались!</span>
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
    import { getGroupInfo, isSubscribe } from "@/services/user";

    export default {
        components: { AppGoodButton, AppBadButton, AppGroupOrUser },
        data() {
            return {
                text1: "НАЧАТЬ РОТАЦИЮ",
                text2: "ВЫБРАТЬ ТАРИФ",
                text3: "ПОДПИСАТЬСЯ",
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
                const response = await getGroupInfo();
                console.log(response);
                this.groupInfo = response;
            },
            async subscribeGroup() {
                if (this.groupInfo) {
                    const newWindow = window.open(
                        this.groupInfo.groupLink,
                        "_blank",
                        "width=800, height=600"
                    );
                    const intervalId = setInterval(async () => {
                        if (newWindow.closed) { 
                            clearInterval(intervalId); 
                            const response = await isSubscribe();
                            console.log(response);
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
</style>